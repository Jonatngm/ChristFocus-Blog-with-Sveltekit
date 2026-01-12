<script lang="ts">
	import type { Post } from '$lib/types';
	import { Calendar, BookOpen, Eye } from 'lucide-svelte';

	export let post: Post;

	const formattedDate = new Date(post.created_at).toLocaleDateString('en-US', {
		year: 'numeric',
		month: 'long',
		day: 'numeric'
	});

	function formatCount(count: number | null | undefined): string {
		if (!count) return '0';
		if (count >= 1000) return (count / 1000).toFixed(1) + 'k';
		return count.toString();
	}
</script>

<a href="/post/{post.id}" class="block h-full">
	<div class="h-full hover:shadow-2xl transition-all duration-300 border-2 border-gray-200 rounded-lg overflow-hidden bg-white hover:border-primary">
		{#if post.cover_image}
			<div class="w-full h-48 overflow-hidden">
				<img
					src={post.cover_image}
					alt={post.title}
					class="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
				/>
			</div>
		{/if}
		
		<div class="p-6">
			{#if post.series}
				<div class="flex items-center gap-2 text-sm text-primary font-semibold mb-2">
					<BookOpen class="w-4 h-4" />
					<span>{post.series.title}</span>
					{#if post.series_order}
						<span>• Part {post.series_order}</span>
					{/if}
				</div>
			{/if}

			<div class="flex items-start justify-between mb-3">
				<h3 class="text-2xl font-bold text-black leading-tight line-clamp-2">
					{post.title}
				</h3>

				{#if typeof post.views !== 'undefined'}
					<div class="ml-4">
						<div class="inline-flex items-center gap-2 bg-primary/20 text-black px-3 py-1 rounded-full shadow-sm border border-primary">
							<Eye class="w-4 h-4" />
							<span class="text-sm font-bold">{formatCount(post.views)}</span>
						</div>
					</div>
				{/if}
			</div>

			<div class="flex items-center gap-2 text-sm text-gray-600 mb-4">
				<Calendar class="w-4 h-4" />
				<span>{formattedDate}</span>
			</div>

			<p class="text-gray-700 line-clamp-3 leading-relaxed mb-4">
				{post.excerpt || post.content.substring(0, 150).replace(/<[^>]*>/g, '') + '...'}
			</p>
			
			<div class="flex flex-wrap gap-2">
				{#if post.categories}
					{#each post.categories as category}
						<span class="px-3 py-1 bg-primary text-black rounded-full text-xs font-bold">
							{category.name}
						</span>
					{/each}
				{/if}
				{#if post.tags}
					{#each post.tags as tag}
						<span class="px-3 py-1 bg-gray-200 text-gray-800 rounded-full text-xs font-medium">
							{tag.name}
						</span>
					{/each}
				{/if}
			</div>
		</div>
	</div>
</a>
