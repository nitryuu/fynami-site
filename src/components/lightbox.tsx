import {
	createEffect,
	createSignal,
	onCleanup,
	onMount,
	type Setter,
	useTransition,
} from "solid-js";

export default function Lightbox({
	selectedImage,
	setSelectedImage,
}: {
	selectedImage: string;
	setSelectedImage: Setter<string | null>;
}) {
	let lightboxEl: HTMLDivElement | undefined;
	let imageWrapperEl: HTMLButtonElement | undefined;

	const [isVisible, setIsVisible] = createSignal(false);
	const [_, start] = useTransition();

	onMount(() => {
		const timeout = setTimeout(() => {
			setIsVisible(true);
			clearTimeout(timeout);
		}, 50);
	});

	const closeLightBox = async () => {
		await start(() => setIsVisible(false));
		const timeout = setTimeout(() => {
			setSelectedImage(null);
			document.body.classList.remove("overflow-hidden");
			clearTimeout(timeout);
			onCleanup(() => clearTimeout(timeout));
		}, 200);
	};

	createEffect(() => {
		if (!isVisible()) return;
		const listener = (event: Event) => {
			const element = imageWrapperEl;
			if (!element || element.contains(event.target as Node)) return;

			closeLightBox();
		};

		document.addEventListener("click", listener);
		onCleanup(() => document.removeEventListener("click", listener));
	});

	return (
		<div
			ref={lightboxEl}
			class={`transition-opacity duration-500 fixed inset-0 bg-black/90 z-90 grid place-items-center ${isVisible() ? "" : "opacity-0"}`}
		>
			<button
				type="button"
				ref={imageWrapperEl}
				class={`px-8 max-w-md mx-auto transform-transform duration-500 !cursor-zoom-out ${isVisible() ? "" : "scale-0"}`}
				on:click={closeLightBox}
			>
				<img src={selectedImage} alt="ligthbox" draggable={false} />
			</button>
		</div>
	);
}
