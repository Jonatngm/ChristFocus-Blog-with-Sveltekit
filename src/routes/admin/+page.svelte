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
	<div class="container mx-auto px-4 sm:px-6 py-8 sm:py-10 md:py-12">
		<div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-6 mb-8 sm:mb-10 md:mb-12 pb-6 sm:pb-8 border-b-2 border-primary">
			<div class="w-full sm:w-auto">
				<h1 class="text-3xl sm:text-4xl md:text-5xl font-extrabold text-black mb-2 tracking-tight leading-tight">Admin <span class="text-primary text-shadow-soft">Dashboard</span></h1>
				<p class="text-gray-600 text-sm sm:text-base md:text-lg">Manage your teachings and content</p>
			</div>
			<a href="/admin/write" class="w-full sm:w-auto">
				<Button class="w-full sm:w-auto bg-gradient-to-r from-primary to-gold-dark hover:from-gold-dark hover:to-primary text-black font-bold text-sm sm:text-base px-5 sm:px-6 py-3 rounded-xl interactive elevated">
					<PlusCircle class="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
					New Teaching
				</Button>
			</a>
		</div>

		<!-- Search Bar -->
		<div class="mb-6 sm:mb-8 md:mb-10">
			<div class="relative max-w-full sm:max-w-xl group">
				<Search class="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400 group-focus-within:text-primary transition-colors" />
				<input
					type="text"
					bind:value={searchQuery}
					placeholder="Search teachings..."
					class="w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-3 sm:py-4 border-2 border-gray-200 rounded-xl bg-white text-black placeholder:text-gray-400 focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all duration-300 outline-none hover:border-gray-300 text-base sm:text-lg"
				/>
			</div>
		</div>

		{#if loading}
			<div class="flex items-center justify-center py-20 sm:py-32">
				<div class="relative">
					<div class="animate-spin rounded-full h-12 w-12 sm:h-16 sm:w-16 border-4 border-primary/20 border-t-primary"></div>
					<div class="absolute inset-0 flex items-center justify-center">
						<div class="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-primary/20"></div>
					</div>
				</div>
			</div>
		{:else}
			<!-- Desktop Table View (hidden on mobile) -->
			<div class="hidden md:block bg-white rounded-2xl border-2 border-gray-200 shadow-xl overflow-hidden">
				<div class="overflow-x-auto">
					<table class="w-full">
						<thead class="bg-gradient-to-r from-gray-900 via-black to-gray-900 text-white">
							<tr>
								<th class="text-left p-4 lg:p-5 font-extrabold text-sm lg:text-base uppercase tracking-wide">Title</th>
								<th class="text-left p-4 lg:p-5 font-extrabold text-sm lg:text-base uppercase tracking-wide">Status</th>
								<th class="text-left p-4 lg:p-5 font-extrabold text-sm lg:text-base uppercase tracking-wide">Views</th>
								<th class="text-left p-4 lg:p-5 font-extrabold text-sm lg:text-base uppercase tracking-wide">Created</th>
								<th class="text-right p-4 lg:p-5 font-extrabold text-sm lg:text-base uppercase tracking-wide">Actions</th>
							</tr>
						</thead>
						<tbody>
							{#each filteredPosts as post, i}
								<tr class="border-b last:border-b-0 hover:bg-gradient-to-r hover:from-primary/5 hover:to-transparent transition-all duration-300 {i % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}">
									<td class="p-4 lg:p-5 font-bold text-black text-sm lg:text-base">{post.title}</td>
									<td class="p-4 lg:p-5">
										<span class="px-3 py-1.5 rounded-full text-xs sm:text-sm font-bold shadow-sm {post.published ? 'bg-gradient-to-r from-primary to-gold-dark text-black' : 'bg-gray-200 text-gray-700'}">
											{post.published ? 'Published' : 'Draft'}
										</span>
									</td>
									<td class="p-4 lg:p-5 text-gray-700 font-semibold text-sm lg:text-base">{post.views || 0}</td>
									<td class="p-4 lg:p-5 text-gray-700 font-medium text-sm">{new Date(post.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</td>
									<td class="p-4 lg:p-5 text-right">
										<div class="flex items-center justify-end gap-2 lg:gap-3">
											<a href="/admin/edit/{post.id}">
												<Button variant="ghost" size="sm" class="hover:bg-primary/20 border border-transparent hover:border-primary transition-all duration-300">
													<Edit class="w-4 h-4 lg:w-5 lg:h-5 text-primary" />
												</Button>
											</a>
											<Button variant="ghost" size="sm" on:click={() => deletePost(post.id)} class="hover:bg-red-50 border border-transparent hover:border-red-300 transition-all duration-300">
												<Trash2 class="w-4 h-4 lg:w-5 lg:h-5 text-red-600" />
											</Button>
										</div>
									</td>
								</tr>
							{/each}
						</tbody>
					</table>
				</div>
			</div>

			<!-- Mobile Card View (visible on mobile and tablet) -->
			<div class="md:hidden space-y-4">
				{#each filteredPosts as post}
					<div class="bg-white rounded-xl border-2 border-gray-200 shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
						<div class="p-4 sm:p-5 space-y-3 sm:space-y-4">
							<div class="flex items-start justify-between gap-3">
								<h3 class="text-base sm:text-lg font-bold text-black leading-tight flex-1">{post.title}</h3>
								<span class="px-2.5 py-1 rounded-full text-xs font-bold shadow-sm flex-shrink-0 {post.published ? 'bg-gradient-to-r from-primary to-gold-dark text-black' : 'bg-gray-200 text-gray-700'}">
									{post.published ? 'Published' : 'Draft'}
								</span>
							</div>
							
							<div class="flex items-center gap-4 text-sm text-gray-600">
								<div class="flex items-center gap-1.5">
									<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
									</svg>
									<span class="font-semibold">{post.views || 0}</span>
								</div>
								<div class="flex items-center gap-1.5">
									<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
									</svg>
									<span>{new Date(post.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
								</div>
							</div>
							
							<div class="flex items-center gap-2 pt-2 border-t border-gray-200">
								<a href="/admin/edit/{post.id}" class="flex-1">
									<Button variant="outline" class="w-full bg-primary/5 hover:bg-primary/10 border-primary/30 hover:border-primary text-black font-bold">
										<Edit class="w-4 h-4 mr-2" />
										Edit
									</Button>
								</a>
								<Button variant="outline" on:click={() => deletePost(post.id)} class="flex-shrink-0 bg-red-50 hover:bg-red-100 border-red-200 hover:border-red-300 text-red-700 font-bold px-4">
									<Trash2 class="w-4 h-4" />
								</Button>
							</div>
						</div>
					</div>
				{/each}
			</div>
		{/if}
	</div>
</div>
