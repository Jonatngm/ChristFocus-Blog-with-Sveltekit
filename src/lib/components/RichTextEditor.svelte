<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { Editor } from '@tiptap/core';
	import StarterKit from '@tiptap/starter-kit';
	import Link from '@tiptap/extension-link';
	import Image from '@tiptap/extension-image';
	import Underline from '@tiptap/extension-underline';
	import TextAlign from '@tiptap/extension-text-align';
	import Highlight from '@tiptap/extension-highlight';

	export let content = '';

	let element: HTMLDivElement;
	let editor: Editor;

	onMount(() => {
		editor = new Editor({
			element: element,
			extensions: [
				StarterKit.configure({
					heading: {
						levels: [1, 2, 3, 4, 5, 6]
					}
				}),
				Link.configure({
					openOnClick: false,
					HTMLAttributes: {
						class: 'text-primary underline'
					}
				}),
				Image.configure({
					HTMLAttributes: {
						class: 'max-w-full h-auto rounded-lg'
					}
				}),
				Underline,
				TextAlign.configure({
					types: ['heading', 'paragraph']
				}),
				Highlight.configure({
					multicolor: true
				})
			],
			content: content,
			editorProps: {
				attributes: {
					class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-xl max-w-none focus:outline-none min-h-[300px] p-4'
				}
			},
			onTransaction: () => {
				editor = editor;
			},
			onUpdate: ({ editor }) => {
				content = editor.getHTML();
			}
		});
	});

	onDestroy(() => {
		if (editor) {
			editor.destroy();
		}
	});

	function addLink() {
		const url = prompt('Enter URL:');
		if (url) {
			editor.chain().focus().setLink({ href: url }).run();
		}
	}

	function addImage() {
		const url = prompt('Enter image URL:');
		if (url) {
			editor.chain().focus().setImage({ src: url }).run();
		}
	}
</script>

<div class="border-2 border-gray-200 rounded-xl overflow-hidden bg-white">
	<!-- Toolbar -->
	<div class="flex flex-wrap gap-1 p-2 border-b-2 border-gray-200 bg-gray-50">
		<!-- Text Formatting -->
		<button
			type="button"
			on:click={() => editor.chain().focus().toggleBold().run()}
			class="p-2 hover:bg-gray-200 rounded transition-colors {editor?.isActive('bold') ? 'bg-primary/20 text-primary' : ''}"
			title="Bold (Ctrl+B)"
		>
			<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 4h8a4 4 0 014 4 4 4 0 01-4 4H6z M6 12h9a4 4 0 014 4 4 4 0 01-4 4H6z" />
			</svg>
		</button>

		<button
			type="button"
			on:click={() => editor.chain().focus().toggleItalic().run()}
			class="p-2 hover:bg-gray-200 rounded transition-colors {editor?.isActive('italic') ? 'bg-primary/20 text-primary' : ''}"
			title="Italic (Ctrl+I)"
		>
			<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6L8 18 M14 6l-2 12" />
			</svg>
		</button>

		<button
			type="button"
			on:click={() => editor.chain().focus().toggleUnderline().run()}
			class="p-2 hover:bg-gray-200 rounded transition-colors {editor?.isActive('underline') ? 'bg-primary/20 text-primary' : ''}"
			title="Underline (Ctrl+U)"
		>
			<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 5v8a5 5 0 0010 0V5 M5 19h14" />
			</svg>
		</button>

		<button
			type="button"
			on:click={() => editor.chain().focus().toggleStrike().run()}
			class="p-2 hover:bg-gray-200 rounded transition-colors {editor?.isActive('strike') ? 'bg-primary/20 text-primary' : ''}"
			title="Strikethrough"
		>
			<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 12h12 M8 5h8a4 4 0 014 4 M8 19h8a4 4 0 01-4-4" />
			</svg>
		</button>

		<div class="w-px h-8 bg-gray-300 mx-1"></div>

		<!-- Headings -->
		<button
			type="button"
			on:click={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
			class="px-3 py-2 hover:bg-gray-200 rounded transition-colors font-bold {editor?.isActive('heading', { level: 1 }) ? 'bg-primary/20 text-primary' : ''}"
			title="Heading 1"
		>
			H1
		</button>

		<button
			type="button"
			on:click={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
			class="px-3 py-2 hover:bg-gray-200 rounded transition-colors font-bold {editor?.isActive('heading', { level: 2 }) ? 'bg-primary/20 text-primary' : ''}"
			title="Heading 2"
		>
			H2
		</button>

		<button
			type="button"
			on:click={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
			class="px-3 py-2 hover:bg-gray-200 rounded transition-colors font-bold {editor?.isActive('heading', { level: 3 }) ? 'bg-primary/20 text-primary' : ''}"
			title="Heading 3"
		>
			H3
		</button>

		<div class="w-px h-8 bg-gray-300 mx-1"></div>

		<!-- Lists -->
		<button
			type="button"
			on:click={() => editor.chain().focus().toggleBulletList().run()}
			class="p-2 hover:bg-gray-200 rounded transition-colors {editor?.isActive('bulletList') ? 'bg-primary/20 text-primary' : ''}"
			title="Bullet List"
		>
			<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16 M4 12h16 M4 18h16" />
			</svg>
		</button>

		<button
			type="button"
			on:click={() => editor.chain().focus().toggleOrderedList().run()}
			class="p-2 hover:bg-gray-200 rounded transition-colors {editor?.isActive('orderedList') ? 'bg-primary/20 text-primary' : ''}"
			title="Numbered List"
		>
			<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
			</svg>
		</button>

		<button
			type="button"
			on:click={() => editor.chain().focus().toggleBlockquote().run()}
			class="p-2 hover:bg-gray-200 rounded transition-colors {editor?.isActive('blockquote') ? 'bg-primary/20 text-primary' : ''}"
			title="Quote"
		>
			<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
			</svg>
		</button>

		<button
			type="button"
			on:click={() => editor.chain().focus().toggleCodeBlock().run()}
			class="p-2 hover:bg-gray-200 rounded transition-colors {editor?.isActive('codeBlock') ? 'bg-primary/20 text-primary' : ''}"
			title="Code Block"
		>
			<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
			</svg>
		</button>

		<div class="w-px h-8 bg-gray-300 mx-1"></div>

		<!-- Link & Image -->
		<button
			type="button"
			on:click={addLink}
			class="p-2 hover:bg-gray-200 rounded transition-colors {editor?.isActive('link') ? 'bg-primary/20 text-primary' : ''}"
			title="Add Link"
		>
			<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
			</svg>
		</button>

		<button
			type="button"
			on:click={addImage}
			class="p-2 hover:bg-gray-200 rounded transition-colors"
			title="Add Image"
		>
			<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
			</svg>
		</button>

		<div class="w-px h-8 bg-gray-300 mx-1"></div>

		<!-- Undo/Redo -->
		<button
			type="button"
			on:click={() => editor.chain().focus().undo().run()}
			class="p-2 hover:bg-gray-200 rounded transition-colors"
			title="Undo (Ctrl+Z)"
			disabled={!editor?.can().undo()}
		>
			<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
			</svg>
		</button>

		<button
			type="button"
			on:click={() => editor.chain().focus().redo().run()}
			class="p-2 hover:bg-gray-200 rounded transition-colors"
			title="Redo (Ctrl+Y)"
			disabled={!editor?.can().redo()}
		>
			<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 10h-10a8 8 0 00-8 8v2M21 10l-6 6m6-6l-6-6" />
			</svg>
		</button>
	</div>

	<!-- Editor Content -->
	<div bind:this={element} class="bg-white"></div>
</div>

<style>
	:global(.ProseMirror) {
		outline: none;
		padding: 1rem;
		min-height: 300px;
	}

	:global(.ProseMirror p) {
		margin: 1em 0;
	}

	:global(.ProseMirror h1) {
		font-size: 2em;
		font-weight: bold;
		margin: 1em 0 0.5em;
	}

	:global(.ProseMirror h2) {
		font-size: 1.5em;
		font-weight: bold;
		margin: 1em 0 0.5em;
	}

	:global(.ProseMirror h3) {
		font-size: 1.25em;
		font-weight: bold;
		margin: 1em 0 0.5em;
	}

	:global(.ProseMirror ul), :global(.ProseMirror ol) {
		padding-left: 2em;
		margin: 1em 0;
	}

	:global(.ProseMirror blockquote) {
		border-left: 4px solid #d4af37;
		padding-left: 1em;
		margin: 1em 0;
		font-style: italic;
		color: #555;
	}

	:global(.ProseMirror code) {
		background: #f4f4f4;
		padding: 0.2em 0.4em;
		border-radius: 4px;
		font-family: monospace;
	}

	:global(.ProseMirror pre) {
		background: #2d2d2d;
		color: #f8f8f2;
		padding: 1em;
		border-radius: 8px;
		overflow-x: auto;
		margin: 1em 0;
	}

	:global(.ProseMirror pre code) {
		background: none;
		padding: 0;
		color: inherit;
	}

	:global(.ProseMirror img) {
		max-width: 100%;
		height: auto;
		border-radius: 8px;
		margin: 1em 0;
	}

	:global(.ProseMirror a) {
		color: #d4af37;
		text-decoration: underline;
	}

	button:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}
</style>
