<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { postService } from '$lib/services/postService';
	import { authStore } from '$lib/stores/authStore';
	import { Button } from '$lib/components/ui/button';
	import { toast } from 'svelte-sonner';
	import { onMount } from 'svelte';
	import type { Category, Tag, Post } from '$lib/types';
	import RichTextEditor from '$lib/components/RichTextEditor.svelte';
	import { X } from 'lucide-svelte';

	let title = '';
	let content = '';
	let excerpt = '';
	let coverImage = '';
	let coverImages: string[] = []; // Array of cover images
	let newCoverImageUrl = ''; // For URL input
	let published = false;
	let featured = false;
	let loading = false;
	let loadingPost = true;
	let uploadingImage = false;
	let imageFiles: File[] = []; // Multiple image files
	let imagePreviews: string[] = []; // Multiple previews
	let categories: Category[] = [];
	let selectedCategories: string[] = [];
	let tagInput = '';
	let tags: string[] = [];
	let allTags: Tag[] = [];
	let post: Post | null = null;

	$: user = $authStore.user;
	$: postId = $page.params.id;

	onMount(async () => {
		try {
			// Load post data
			post = await postService.getPostById(postId);
			
			if (post) {
				title = post.title;
				content = post.content;
				excerpt = post.excerpt || '';
				coverImage = post.cover_image || '';
				coverImages = post.cover_images || [];
				published = post.published;
				featured = post.featured;
				selectedCategories = post.categories?.map(c => c.id) || [];
				tags = post.tags?.map(t => t.name) || [];
			}

			// Load categories and tags
			categories = await postService.getCategories();
			allTags = await postService.getTags();
		} catch (error) {
			console.error('Error loading post:', error);
			toast.error('Failed to load post');
			goto('/admin');
		} finally {
			loadingPost = false;
		}
	});

	function addTag() {
		if (tagInput.trim() && !tags.includes(tagInput.trim())) {
			tags = [...tags, tagInput.trim()];
			tagInput = '';
		}
	}

	function removeTag(tag: string) {
		tags = tags.filter(t => t !== tag);
	}

	async function handleImageUpload(e: Event) {
		const input = e.target as HTMLInputElement;
		const files = input.files;
		
		if (!files || files.length === 0) return;
		
		// Limit to 6 images total
		if (imageFiles.length + files.length > 6) {
			toast.error('You can upload maximum 6 images');
			return;
		}
		
		for (const file of Array.from(files)) {
			// Validate file type
			if (!file.type.startsWith('image/')) {
				toast.error(`${file.name} is not an image file`);
				continue;
			}
			
			// Validate file size (5MB max)
			if (file.size > 5 * 1024 * 1024) {
				toast.error(`${file.name} is larger than 5MB`);
				continue;
			}
			
			imageFiles = [...imageFiles, file];
			
			// Create preview
			const reader = new FileReader();
			reader.onload = (e) => {
				imagePreviews = [...imagePreviews, e.target?.result as string];
			};
			reader.readAsDataURL(file);
		}
	}

	function removeImage(index: number) {
		imageFiles = imageFiles.filter((_, i) => i !== index);
		imagePreviews = imagePreviews.filter((_, i) => i !== index);
	}
	
	function removeCoverImageUrl(index: number) {
		coverImages = coverImages.filter((_, i) => i !== index);
	}
	
	function addCoverImageUrl() {
		if (newCoverImageUrl.trim()) {
			if (coverImages.length >= 6) {
				toast.error('Maximum 6 images allowed');
				return;
			}
			coverImages = [...coverImages, newCoverImageUrl.trim()];
			newCoverImageUrl = '';
		}
	}

	async function handleSubmit(e: Event) {
		e.preventDefault();
		
		if (!user) {
			toast.error('You must be logged in to edit a post');
			return;
		}

		if (!title.trim() || !content.trim()) {
			toast.error('Title and content are required');
			return;
		}

		loading = true;

		try {
			// Upload all images if provided
			let uploadedImageUrls: string[] = [...coverImages];
			if (imageFiles.length > 0) {
				uploadingImage = true;
				try {
					for (const file of imageFiles) {
						const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}-${file.name}`;
						const url = await postService.uploadImage(file, fileName);
						uploadedImageUrls.push(url);
					}
					toast.success(`${imageFiles.length} image(s) uploaded successfully`);
				} catch (error: any) {
					console.error('Error uploading images:', error);
					toast.error('Failed to upload some images');
				} finally {
					uploadingImage = false;
				}
			}

			await postService.updatePost(postId, {
				title,
				content,
				excerpt: excerpt || content.substring(0, 200),
				published,
				featured,
				cover_image: uploadedImageUrls[0] || '',
				cover_images: uploadedImageUrls.length > 0 ? uploadedImageUrls : undefined,
				category_ids: selectedCategories,
				tag_names: tags,
				scheduled_at: null as any,
				series_id: null as any,
				series_order: null as any
			});

			toast.success('Teaching updated successfully!');
			goto('/admin');
		} catch (error: any) {
			console.error('Error updating post:', error);
			toast.error(error.message || 'Failed to update post');
		} finally {
			loading = false;
		}
	}
</script>

<svelte:head>
	<title>Edit Teaching - ChristFocus</title>
</svelte:head>

<div class="min-h-screen bg-background">
	<div class="container mx-auto px-4 py-8 max-w-4xl">
		{#if loadingPost}
			<div class="flex items-center justify-center py-20">
				<div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
			</div>
		{:else}
			<div class="flex items-center justify-between mb-8">
				<h1 class="text-3xl font-bold">Edit Teaching</h1>
				<a href="/admin">
					<Button variant="outline">Cancel</Button>
				</a>
			</div>

			<form on:submit={handleSubmit} class="space-y-6">
				<div class="bg-card p-6 rounded-lg border space-y-6">
					<!-- Title -->
					<div class="space-y-2">
						<label for="title" class="text-sm font-medium text-foreground">Title</label>
						<input
							id="title"
							type="text"
							bind:value={title}
							required
							class="w-full px-4 py-3 border-2 border-input rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none"
							placeholder="Enter your teaching title..."
						/>
					</div>

					<!-- Content -->
					<div class="space-y-2">
						<label for="content" class="text-sm font-medium text-foreground">Content</label>
						<RichTextEditor bind:content placeholder="Write your teaching content here..." />
					</div>

					<!-- Excerpt -->
					<div class="space-y-2">
						<label for="excerpt" class="text-sm font-medium text-foreground">Excerpt (Optional)</label>
						<textarea
							id="excerpt"
							bind:value={excerpt}
							rows="3"
							class="w-full px-4 py-3 border-2 border-input rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none resize-y"
							placeholder="Brief summary for preview..."
						></textarea>
					</div>

					<!-- Cover Images (1-6) -->
					<div class="space-y-2">
						<label class="text-sm font-medium text-foreground">Cover Images (Optional - Max 6 for carousel)</label>
						<p class="text-xs text-muted-foreground">Add 1-6 images. Multiple images will display as a carousel.</p>
						
						<!-- Image previews grid -->
						{#if imagePreviews.length > 0 || coverImages.length > 0}
							<div class="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-4">
								{#each imagePreviews as preview, index}
									<div class="relative rounded-lg overflow-hidden border-2 border-input">
										<img src={preview} alt="Preview {index + 1}" class="w-full h-32 object-cover" />
										<button
											type="button"
											on:click={() => removeImage(index)}
											aria-label="Remove image {index + 1}"
											class="absolute top-1 right-1 bg-destructive text-destructive-foreground p-1.5 rounded-full hover:bg-destructive/90 transition-colors"
										>
											<X class="w-4 h-4" />
										</button>
										<div class="absolute bottom-1 left-1 bg-black/70 text-white text-xs px-2 py-0.5 rounded">
											File {index + 1}
										</div>
									</div>
								{/each}
								{#each coverImages as url, index}
									<div class="relative rounded-lg overflow-hidden border-2 border-input">
										<img src={url} alt="Cover {index + 1}" class="w-full h-32 object-cover" />
										<button
											type="button"
											on:click={() => removeCoverImageUrl(index)}
											aria-label="Remove URL {index + 1}"
											class="absolute top-1 right-1 bg-destructive text-destructive-foreground p-1.5 rounded-full hover:bg-destructive/90 transition-colors"
										>
											<X class="w-4 h-4" />
										</button>
										<div class="absolute bottom-1 left-1 bg-black/70 text-white text-xs px-2 py-0.5 rounded">
											URL {index + 1}
										</div>
									</div>
								{/each}
							</div>
						{/if}
						
						<!-- Upload button -->
						{#if imagePreviews.length + coverImages.length < 6}
							<div class="border-2 border-dashed border-input rounded-lg p-6 text-center hover:border-primary transition-colors">
								<input
									id="coverImages"
									type="file"
									accept="image/*"
									multiple
									on:change={handleImageUpload}
									class="hidden"
								/>
								<label for="coverImages" class="cursor-pointer">
									<div class="flex flex-col items-center gap-2">
										<svg class="w-10 h-10 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
										</svg>
										<span class="text-sm text-foreground font-medium">Click to upload images</span>
										<span class="text-xs text-muted-foreground">PNG, JPG, GIF up to 5MB each ({imagePreviews.length + coverImages.length}/6)</span>
									</div>
								</label>
							</div>
							
							<div class="flex gap-2">
								<input
									type="url"
									bind:value={newCoverImageUrl}
									class="flex-1 px-4 py-2 border-2 border-input rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none text-sm"
									placeholder="Or paste image URL..."
								/>
								<button
									type="button"
									on:click={addCoverImageUrl}
									disabled={!newCoverImageUrl || imagePreviews.length + coverImages.length >= 6}
									class="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium"
								>
									Add URL
								</button>
							</div>
						{:else}
							<p class="text-sm text-muted-foreground text-center py-4 bg-muted/50 rounded-lg">
								Maximum 6 images reached
							</p>
						{/if}
					</div>

					<!-- Categories -->
					<div class="space-y-2">
						<div class="text-sm font-medium text-foreground">Categories</div>
						<div class="grid grid-cols-2 gap-3">
							{#each categories as category}
								<label class="flex items-center space-x-2 cursor-pointer">
									<input
										type="checkbox"
										bind:group={selectedCategories}
										value={category.id}
										class="w-4 h-4 rounded border-input text-primary focus:ring-2 focus:ring-primary/20"
									/>
									<span class="text-sm">{category.name}</span>
								</label>
							{/each}
						</div>
					</div>

					<!-- Tags -->
					<div class="space-y-2">
						<label for="tagInput" class="text-sm font-medium text-foreground">Tags</label>
						<div class="flex gap-2">
							<input
								id="tagInput"
								type="text"
								bind:value={tagInput}
								on:keydown={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
								class="flex-1 px-4 py-3 border-2 border-input rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none"
								placeholder="Add tags..."
							/>
							<Button type="button" on:click={addTag}>Add</Button>
						</div>
						{#if tags.length > 0}
							<div class="flex flex-wrap gap-2 mt-3">
								{#each tags as tag}
									<span class="inline-flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
										{tag}
										<button
											type="button"
											on:click={() => removeTag(tag)}
											class="hover:text-destructive"
										>
											×
										</button>
									</span>
								{/each}
							</div>
						{/if}
					</div>

					<!-- Options -->
					<div class="space-y-3 pt-4 border-t">
						<label class="flex items-center space-x-2 cursor-pointer">
							<input
								type="checkbox"
								bind:checked={published}
								class="w-4 h-4 rounded border-input text-primary focus:ring-2 focus:ring-primary/20"
							/>
							<span class="text-sm font-medium">Publish immediately</span>
						</label>
						<label class="flex items-center space-x-2 cursor-pointer">
							<input
								type="checkbox"
								bind:checked={featured}
								class="w-4 h-4 rounded border-input text-primary focus:ring-2 focus:ring-primary/20"
							/>
							<span class="text-sm font-medium">Feature this post</span>
						</label>
					</div>
				</div>

				<!-- Submit Button -->
				<div class="flex justify-end gap-3">
					<Button type="submit" disabled={loading || uploadingImage} class="min-w-[150px]">
						{uploadingImage ? 'Uploading Image...' : loading ? 'Updating...' : 'Update Teaching'}
					</Button>
				</div>
			</form>
		{/if}
	</div>
</div>
