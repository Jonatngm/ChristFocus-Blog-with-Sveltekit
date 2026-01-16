import { supabase } from './supabase';

export interface Comment {
	id: string;
	post_id: string;
	user_id: string;
	content: string;
	created_at: string;
	updated_at: string;
	user_email?: string;
}

export interface CreateCommentData {
	post_id: string;
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
			
			// Map to include a placeholder for user_email (will be fetched client-side)
			return (data || []).map(comment => ({
				...comment,
				user_email: 'User' // Placeholder, will show email part in UI
			}));
		} catch (error) {
			console.error('Error in getPostComments:', error);
			return [];
		}
	},

	// Create a new comment
	async createComment(userId: string, commentData: CreateCommentData): Promise<Comment> {
		const { data, error } = await supabase
			.from('comments')
			.insert({
				post_id: commentData.post_id,
				user_id: userId,
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
