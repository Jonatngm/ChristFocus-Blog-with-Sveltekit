import { supabase } from './supabase';

export interface Comment {
	id: string;
	post_id: string;
	user_id?: string | null;
	author_name: string;
	author_email?: string | null;
	content: string;
	session_id?: string | null;
	parent_id?: string | null;
	likes_count?: number;
	created_at: string;
	updated_at: string;
}

export interface CreateCommentData {
	post_id: string;
	author_name: string;
	author_email?: string;
	content: string;
	session_id?: string;
	parent_id?: string | null;
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
				content: commentData.content,
				session_id: commentData.session_id || null,
				parent_id: commentData.parent_id || null
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
	},

	// Toggle like on a comment
	async toggleCommentLike(
		commentId: string,
		userId?: string | null,
		sessionId?: string | null
	): Promise<{ action: string; likes_count: number }> {
		const { data, error } = await supabase.rpc('toggle_comment_like', {
			p_comment_id: commentId,
			p_user_id: userId || null,
			p_session_id: sessionId || null
		});

		if (error) {
			console.error('Error toggling comment like:', error);
			throw error;
		}

		return data;
	},

	// Get liked status for multiple comments
	async getCommentLikesStatus(
		commentIds: string[],
		userId?: string | null,
		sessionId?: string | null
	): Promise<Record<string, boolean>> {
		if (commentIds.length === 0) return {};

		const { data, error } = await supabase.rpc('get_comment_likes_status', {
			p_comment_ids: commentIds,
			p_user_id: userId || null,
			p_session_id: sessionId || null
		});

		if (error) {
			console.error('Error fetching comment likes status:', error);
			return {};
		}

		return data || {};
	}
};
