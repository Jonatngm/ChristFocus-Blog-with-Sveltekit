<script lang="ts">
	import { goto } from '$app/navigation';
	import { postService } from '$lib/services/postService';
	import { authStore } from '$lib/stores/authStore';
	import { Button } from '$lib/components/ui/button';
	import { toast } from 'svelte-sonner';
	import { onMount } from 'svelte';
	import type { Category, Tag } from '$lib/types';
	import RichTextEditor from '$lib/components/RichTextEditor.svelte';
	import { X } from 'lucide-svelte';

	let title = '';
	let content = '';
	let excerpt = '';
	let coverImage = '';
	let coverImages: string[] = []; // Array of cover images
	let published = false;
	let featured = false;
	let loading = false;
	let uploadingImage = false;
	let imageFiles: File[] = []; // Multiple image files
	let imagePreviews: string[] = []; // Multiple previews
	let categories: Category[] = [];
	let selectedCategories: string[] = [];
	let tagInput = '';
	let tags: string[] = [];
	let allTags: Tag[] = [];

	$: user = $authStore.user;

	onMount(async () => {
		try {
			categories = await postService.getCategories();
			allTags = await postService.getTags();
		} catch (error) {
			console.error('Error loading data:', error);
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
		if (coverImage.trim()) {
			if (coverImages.length >= 6) {
				toast.error('Maximum 6 images allowed');
				return;
			}
			coverImages = [...coverImages, coverImage.trim()];
			coverImage = '';
		}
	}

	async function handleSubmit(e: Event) {
		e.preventDefault();
		
		if (!user) {
			toast.error('You must be logged in to create a post');
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

			await postService.createPost(user.id, {
				title,
				content,
				excerpt: excerpt || content.substring(0, 200),
				published,
				featured,
				cover_image: uploadedImageUrls[0] || '', // First image as primary
				cover_images: uploadedImageUrls.length > 0 ? uploadedImageUrls : undefined,
				category_ids: selectedCategories,
				tag_names: tags,
			scheduled_at: null as any,
			series_id: null as any,
			series_order: null as any
		});

		toast.success('Post created successfully!');
		goto('/admin');
	} catch (error: any) {
		console.error('Error creating post:', error);
		toast.error(error.message || 'Failed to create post');
	} finally {
		loading = false;
	}
}
</script>

<svelte:head>
	<title>Write Post - ChristFocus</title>
</svelte:head>

<div class="min-h-screen bg-white">
	<div class="container mx-auto px-4 sm:px-6 py-6 sm:py-8 max-w-4xl">
		<div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 sm:mb-8">
			<h1 class="text-2xl sm:text-3xl font-bold text-black">Write New Teaching</h1>
			<a href="/admin">
				<Button variant="outline" class="w-full sm:w-auto">Cancel</Button>
			</a>
		</div>

		<form on:submit={handleSubmit} class="space-y-5 sm:space-y-6">
			<div class="bg-white p-4 sm:p-5 md:p-6 rounded-xl border-2 border-gray-200 space-y-5 sm:space-y-6 shadow-lg">
				<!-- Title -->
				<div class="space-y-2">
					<label for="title" class="text-xs sm:text-sm font-bold text-black uppercase tracking-wide">Title</label>
					<input
						id="title"
						type="text"
						bind:value={title}
						required
						class="w-full px-3 sm:px-4 py-2.5 sm:py-3 border-2 border-gray-200 rounded-xl bg-white text-black placeholder:text-gray-400 focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none text-sm sm:text-base"
						placeholder="Enter your teaching title..."
					/>
				</div>

				<!-- Content -->
				<div class="space-y-2">
					<label for="content" class="text-xs sm:text-sm font-bold text-black uppercase tracking-wide">Content</label>
					<RichTextEditor bind:content placeholder="Write your teaching content here..." />
				</div>

				<!-- Excerpt -->
				<div class="space-y-2">
					<label for="excerpt" class="text-xs sm:text-sm font-bold text-black uppercase tracking-wide">Excerpt (Optional)</label>
					<textarea
						id="excerpt"
						bind:value={excerpt}
						rows="3"
						class="w-full px-3 sm:px-4 py-2.5 sm:py-3 border-2 border-gray-200 rounded-xl bg-white text-black placeholder:text-gray-400 focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none resize-y text-sm sm:text-base"
						placeholder="Brief summary for preview..."
					></textarea>
				</div>

				<!-- Cover Image -->
				<div class="space-y-2">
					<label for="coverImage" class="text-sm font-medium text-foreground">Cover Image (Optional)</label>
					
					{#if !imagePreview && !coverImage}
						<div class="border-2 border-dashed border-input rounded-lg p-8 text-center hover:border-primary transition-colors">
							<input
								id="coverImage"
								type="file"
								accept="image/*"
								on:change={handleImageUpload}
								class="hidden"
							/>
							<label for="coverImage" class="cursor-pointer">
								<div class="flex flex-col items-center gap-2">
									<svg class="w-12 h-12 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
									</svg>
									<span class="text-sm text-foreground font-medium">Click to upload image</span>
									<span class="text-xs text-muted-foreground">PNG, JPG, GIF up to 5MB</span>
								</div>
							</label>
						</div>
					{:else}
						<div class="relative rounded-lg overflow-hidden border-2 border-input">
							<img src={imagePreview || coverImage} alt="Preview" class="w-full h-64 object-cover" />
							<button
								type="button"
								on:click={removeImage}							aria-label="Remove image"								class="absolute top-2 right-2 bg-destructive text-destructive-foreground p-2 rounded-full hover:bg-destructive/90 transition-colors"
							>
								<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
								</svg>
							</button>
						</div>
					{/if}
					
					<p class="text-xs text-muted-foreground mt-2">Or paste an image URL:</p>
					<input
						type="url"
						bind:value={coverImage}
						on:input={() => { imageFile = null; imagePreview = ''; }}
						class="w-full px-4 py-2 border-2 border-input rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none text-sm"
						placeholder="https://example.com/image.jpg"
					/>
				</div>

				<!-- Categories -->
				<div class="space-y-2">
					<div class="text-xs sm:text-sm font-bold text-black uppercase tracking-wide">Categories</div>
					<div class="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
						{#each categories as category}
							<label class="flex items-center space-x-2 cursor-pointer p-2 hover:bg-gray-50 rounded-lg transition-colors">
								<input
									type="checkbox"
									bind:group={selectedCategories}
									value={category.id}
									class="w-4 h-4 rounded border-gray-300 text-primary focus:ring-2 focus:ring-primary/20"
								/>
								<span class="text-sm font-medium text-black">{category.name}</span>
							</label>
						{/each}
					</div>
				</div>

				<!-- Tags -->
				<div class="space-y-2">
					<label for="tagInput" class="text-xs sm:text-sm font-bold text-black uppercase tracking-wide">Tags</label>
					<div class="flex flex-col sm:flex-row gap-2">
						<input
							id="tagInput"
							type="text"
							bind:value={tagInput}
							on:keydown={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
							class="flex-1 px-3 sm:px-4 py-2.5 sm:py-3 border-2 border-gray-200 rounded-xl bg-white text-black placeholder:text-gray-400 focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none text-sm sm:text-base"
							placeholder="Add tags..."
						/>
						<Button type="button" on:click={addTag} class="w-full sm:w-auto">Add</Button>
					</div>
					{#if tags.length > 0}
						<div class="flex flex-wrap gap-2 mt-3">
							{#each tags as tag}
								<span class="inline-flex items-center gap-1 px-2.5 sm:px-3 py-1 sm:py-1.5 bg-primary/10 text-primary rounded-full text-xs sm:text-sm font-semibold">
									{tag}
									<button
										type="button"
										on:click={() => removeTag(tag)}
										class="hover:text-red-600 text-base sm:text-lg font-bold"
									>
										×
									</button>
								</span>
							{/each}
						</div>
					{/if}
				</div>

				<!-- Options -->
				<div class="space-y-3 pt-4 border-t-2 border-gray-200">
					<label class="flex items-center space-x-2 sm:space-x-3 cursor-pointer p-2 hover:bg-gray-50 rounded-lg transition-colors">
						<input
							type="checkbox"
							bind:checked={published}
							class="w-4 h-4 sm:w-5 sm:h-5 rounded border-gray-300 text-primary focus:ring-2 focus:ring-primary/20"
						/>
						<span class="text-sm sm:text-base font-bold text-black">Publish immediately</span>
					</label>
					<label class="flex items-center space-x-2 sm:space-x-3 cursor-pointer p-2 hover:bg-gray-50 rounded-lg transition-colors">
						<input
							type="checkbox"
							bind:checked={featured}
							class="w-4 h-4 sm:w-5 sm:h-5 rounded border-gray-300 text-primary focus:ring-2 focus:ring-primary/20"
						/>
						<span class="text-sm sm:text-base font-bold text-black">Feature this post</span>
					</label>
				</div>
			</div>

			<!-- Submit Button -->
			<div class="flex flex-col sm:flex-row justify-end gap-3">
				<Button type="submit" disabled={loading || uploadingImage} class="w-full sm:w-auto sm:min-w-[150px] bg-gradient-to-r from-primary to-gold-dark hover:from-gold-dark hover:to-primary text-black font-bold">
					{uploadingImage ? 'Uploading Image...' : loading ? 'Creating...' : 'Create Teaching'}
				</Button>
			</div>
		</form>
	</div>
</div>
