import { supabase } from './supabase';

export interface Comment {
	id: string;
	post_id: string;
	user_id?: string | null;
	author_name: string;
	author_email?: string | null;
	content: string;
	created_at: string;
	updated_at: string;
}

export interface CreateCommentData {
	post_id: string;
	author_name: string;
	author_email?: string;
	content: string;
}

export const commentService = {
	// Get all comments for a post with user email
	async getPostComments(postId: string): Promise<Comment[]> {
		try {
			// First try using RPC function
			const { data: rpcData, error: rpcError } = await supabase.rpc('get_post_comments', {
				post_uuid: postId
			});

			if (!rpcError && rpcData) {
				console.log('Comments fetched via RPC:', rpcData);
				return rpcData;
			}

			// Fallback to direct query if RPC fails
			console.log('RPC failed, using direct query. Error:', rpcError);
			
			const { data, error } = await supabase
				.from('comments')
				.select('*')
				.eq('post_id', postId)
				.order('created_at', { ascending: false });

			if (error) {
				console.error('Error fetching comments via direct query:', error);
				return [];
			}

			console.log('Comments fetched via direct query:', data);
			
			return data || [];
		} catch (error) {
			console.error('Error in getPostComments:', error);
			return [];
		}
	},

	// Create a new comment (no authentication required)
	async createComment(commentData: CreateCommentData, userId?: string): Promise<Comment> {
		const { data, error } = await supabase
			.from('comments')
			.insert({
				post_id: commentData.post_id,
				user_id: userId || null,
				author_name: commentData.author_name,
				author_email: commentData.author_email || null,
				content: commentData.content
			})
			.select()
			.single();

		if (error) {
			console.error('Error creating comment:', error);
			throw error;
		}

		return data;
	},

	// Update a comment
	async updateComment(commentId: string, content: string): Promise<Comment> {
		const { data, error } = await supabase
			.from('comments')
			.update({ content, updated_at: new Date().toISOString() })
			.eq('id', commentId)
			.select()
			.single();

		if (error) {
			console.error('Error updating comment:', error);
			throw error;
		}

		return data;
	},

	// Delete a comment
	async deleteComment(commentId: string): Promise<void> {
		const { error } = await supabase.from('comments').delete().eq('id', commentId);

		if (error) {
			console.error('Error deleting comment:', error);
			throw error;
		}
	}
};
