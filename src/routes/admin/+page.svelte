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
	<div class="container mx-auto px-4 py-12">
		<div class="flex items-center justify-between mb-12 pb-8 border-b-2 border-primary">
			<div>
				<h1 class="text-5xl font-extrabold text-foreground mb-2 tracking-tight">Admin <span class="text-primary text-shadow-soft">Dashboard</span></h1>
				<p class="text-gray-600 text-lg">Manage your teachings and content</p>
			</div>
			<a href="/admin/write">
				<Button class="bg-gradient-to-r from-primary to-gold-dark hover:from-gold-dark hover:to-primary text-black font-bold text-base px-6 py-3 rounded-xl interactive elevated">
					<PlusCircle class="w-5 h-5 mr-2" />
					New Teaching
				</Button>
			</a>
		</div>

		<!-- Search Bar -->
		<div class="mb-10">
			<div class="relative max-w-xl group">
				<Search class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-primary transition-colors" />
				<input
					type="text"
					bind:value={searchQuery}
					placeholder="Search teachings..."
					class="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl bg-white text-foreground placeholder:text-gray-400 focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all duration-300 outline-none hover:border-gray-300 text-lg"
				/>
			</div>
		</div>

		{#if loading}
			<div class="flex items-center justify-center py-32">
				<div class="relative">
					<div class="animate-spin rounded-full h-16 w-16 border-4 border-primary/20 border-t-primary"></div>
					<div class="absolute inset-0 flex items-center justify-center">
						<div class="w-8 h-8 rounded-full bg-primary/20"></div>
					</div>
				</div>
			</div>
		{:else}
			<div class="bg-white rounded-2xl border-2 border-gray-200 shadow-xl overflow-hidden">
				<div class="overflow-x-auto">
					<table class="w-full">
						<thead class="bg-gradient-to-r from-gray-900 via-black to-gray-900 text-white">
							<tr>
								<th class="text-left p-5 font-extrabold text-base uppercase tracking-wide">Title</th>
								<th class="text-left p-5 font-extrabold text-base uppercase tracking-wide">Status</th>
								<th class="text-left p-5 font-extrabold text-base uppercase tracking-wide">Views</th>
								<th class="text-left p-5 font-extrabold text-base uppercase tracking-wide">Created</th>
								<th class="text-right p-5 font-extrabold text-base uppercase tracking-wide">Actions</th>
							</tr>
						</thead>
						<tbody>
							{#each filteredPosts as post, i}
								<tr class="border-b last:border-b-0 hover:bg-gradient-to-r hover:from-primary/5 hover:to-transparent transition-all duration-300 {i % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}">
									<td class="p-5 font-bold text-foreground text-base">{post.title}</td>
									<td class="p-5">
										<span class="px-4 py-2 rounded-full text-sm font-bold shadow-sm {post.published ? 'bg-gradient-to-r from-primary to-gold-dark text-black' : 'bg-gray-200 text-gray-700'}">
											{post.published ? 'Published' : 'Draft'}
										</span>
									</td>
									<td class="p-5 text-gray-700 font-semibold text-base">{post.views || 0}</td>
									<td class="p-5 text-gray-700 font-medium">{new Date(post.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</td>
									<td class="p-5 text-right">
										<div class="flex items-center justify-end gap-3">
											<a href="/admin/edit/{post.id}">
												<Button variant="ghost" size="sm" class="hover:bg-primary/20 border border-transparent hover:border-primary transition-all duration-300">
													<Edit class="w-5 h-5 text-primary" />
												</Button>
											</a>
											<Button variant="ghost" size="sm" on:click={() => deletePost(post.id)} class="hover:bg-red-50 border border-transparent hover:border-red-300 transition-all duration-300">
												<Trash2 class="w-5 h-5 text-red-600" />
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
