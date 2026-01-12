<script lang="ts">
	import { postService } from '$lib/services/postService';
	import { onMount } from 'svelte';
	import { Button } from '$lib/components/ui/button';
	import { PlusCircle, Edit, Trash2, Search } from 'lucide-svelte';
	import type { Post } from '$lib/types';
	import { toast } from 'svelte-sonner';

	let posts: Post[] = [];
	let filteredPosts: Post[] = [];
	let loading = true;
	let searchQuery = '';

	async function loadPosts() {
		try {
			posts = await postService.getAllPosts();
			filteredPosts = posts;
		} catch (error) {
			console.error('Error loading posts:', error);
			toast.error('Failed to load posts');
		} finally {
			loading = false;
		}
	}

	async function deletePost(id: string) {
		if (!confirm('Are you sure you want to delete this teaching?')) return;

		try {
			await postService.deletePost(id);
			posts = posts.filter(p => p.id !== id);
			filterPosts();
			toast.success('Teaching deleted successfully');
		} catch (error) {
			console.error('Error deleting post:', error);
			toast.error('Failed to delete post');
		}
	}

	function filterPosts() {
		if (!searchQuery.trim()) {
			filteredPosts = posts;
		} else {
			const query = searchQuery.toLowerCase();
			filteredPosts = posts.filter(post => 
				post.title.toLowerCase().includes(query) ||
				post.content.toLowerCase().includes(query) ||
				(post.excerpt && post.excerpt.toLowerCase().includes(query))
			);
		}
	}

	$: searchQuery, filterPosts();

	onMount(loadPosts);
</script>

<svelte:head>
	<title>Admin Dashboard - ChristFocus</title>
</svelte:head>

<div class="min-h-screen bg-white">
	<div class="container mx-auto px-4 py-8">
		<div class="flex items-center justify-between mb-8 border-b-2 border-primary pb-6">
			<h1 class="text-4xl font-bold text-black">Admin <span class="text-primary">Dashboard</span></h1>
			<a href="/admin/write">
				<Button class="bg-primary hover:bg-gold-dark text-black font-bold shadow-lg">
					<PlusCircle class="w-5 h-5 mr-2" />
					New Teaching
				</Button>
			</a>
		</div>

		<!-- Search Bar -->
		<div class="mb-8">
			<div class="relative max-w-md">
				<Search class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
				<input
					type="text"
					bind:value={searchQuery}
					placeholder="Search teachings..."
					class="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-lg bg-white text-black placeholder:text-gray-400 focus:border-primary focus:ring-2 focus:ring-primary/30 transition-all outline-none hover:border-gray-400"
				/>
			</div>
		</div>

		{#if loading}
			<div class="flex items-center justify-center py-20">
				<div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
			</div>
		{:else}
			<div class="bg-white rounded-lg border-2 border-gray-200 shadow-lg overflow-hidden">
				<div class="overflow-x-auto">
					<table class="w-full">
						<thead class="bg-gradient-to-r from-gray-900 to-black text-white">
							<tr>
								<th class="text-left p-4 font-bold">Title</th>
								<th class="text-left p-4 font-bold">Status</th>
								<th class="text-left p-4 font-bold">Views</th>
								<th class="text-left p-4 font-bold">Created</th>
								<th class="text-right p-4 font-bold">Actions</th>
							</tr>
						</thead>
						<tbody>
							{#each filteredPosts as post}
								<tr class="border-b last:border-b-0 hover:bg-gray-50 transition-colors">
									<td class="p-4 font-medium text-black">{post.title}</td>
									<td class="p-4">
										<span class="px-3 py-1 rounded-full text-xs font-semibold {post.published ? 'bg-primary text-black' : 'bg-gray-200 text-gray-800'}">
											{post.published ? 'Published' : 'Draft'}
										</span>
									</td>
									<td class="p-4 text-gray-700">{post.views || 0}</td>
									<td class="p-4 text-gray-700">{new Date(post.created_at).toLocaleDateString()}</td>
									<td class="p-4 text-right">
										<div class="flex items-center justify-end gap-2">
											<a href="/admin/edit/{post.id}">
												<Button variant="ghost" size="sm" class="hover:bg-primary/20">
													<Edit class="w-4 h-4" />
												</Button>
											</a>
											<Button variant="ghost" size="sm" on:click={() => deletePost(post.id)} class="hover:bg-red-100">
												<Trash2 class="w-4 h-4 text-red-600" />
											</Button>
										</div>
									</td>
								</tr>
							{/each}
						</tbody>
					</table>
				</div>
			</div>
		{/if}
	</div>
</div>
