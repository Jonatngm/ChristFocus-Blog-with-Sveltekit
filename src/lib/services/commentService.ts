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
	// Get all comments for a post
	async getPostComments(postId: string): Promise<Comment[]> {
		const { data, error } = await supabase.rpc('get_post_comments', {
			post_uuid: postId
		});

		if (error) {
			console.error('Error fetching comments:', error);
			throw error;
		}

		return data || [];
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
