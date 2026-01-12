<script lang="ts">
	import { goto } from '$app/navigation';
	import { postService } from '$lib/services/postService';
	import { authStore } from '$lib/stores/authStore';
	import { Button } from '$lib/components/ui/button';
	import { toast } from 'svelte-sonner';
	import { onMount } from 'svelte';
	import type { Category, Tag } from '$lib/types';

	let title = '';
	let content = '';
	let excerpt = '';
	let coverImage = '';
	let published = false;
	let featured = false;
	let loading = false;
	let uploadingImage = false;
	let imageFile: File | null = null;
	let imagePreview = '';
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
		const file = input.files?.[0];
		
		if (!file) return;
		
		// Validate file type
		if (!file.type.startsWith('image/')) {
			toast.error('Please select an image file');
			return;
		}
		
		// Validate file size (5MB max)
		if (file.size > 5 * 1024 * 1024) {
			toast.error('Image size must be less than 5MB');
			return;
		}
		
		imageFile = file;
		
		// Create preview
		const reader = new FileReader();
		reader.onload = (e) => {
			imagePreview = e.target?.result as string;
		};
		reader.readAsDataURL(file);
	}

	function removeImage() {
		imageFile = null;
		imagePreview = '';
		coverImage = '';
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
			// Upload image if provided
			let uploadedImageUrl = coverImage;
			if (imageFile) {
				uploadingImage = true;
				try {
					const fileName = `${Date.now()}-${imageFile.name}`;
					uploadedImageUrl = await postService.uploadImage(imageFile, fileName);
					toast.success('Image uploaded successfully');
				} catch (error: any) {
					console.error('Error uploading image:', error);
					toast.error('Failed to upload image, continuing without image');
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
				cover_image: uploadedImageUrl || '',
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

<div class="min-h-screen bg-background">
	<div class="container mx-auto px-4 py-8 max-w-4xl">
		<div class="flex items-center justify-between mb-8">
			<h1 class="text-3xl font-bold">Write New Teaching</h1>
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
					<textarea
						id="content"
						bind:value={content}
						required
						rows="15"
						class="w-full px-4 py-3 border-2 border-input rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none resize-y"
						placeholder="Write your teaching content here..."
					></textarea>
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
					{uploadingImage ? 'Uploading Image...' : loading ? 'Creating...' : 'Create Teaching'}
				</Button>
			</div>
		</form>
	</div>
</div>
