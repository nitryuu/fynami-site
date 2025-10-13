import {
	type Accessor,
	createEffect,
	createSignal,
	For,
	onCleanup,
	onMount,
	type Setter,
	Show,
} from "solid-js";
import { Portal } from "solid-js/web";
import Lightbox from "./lightbox";
import Screenshot from "./screenshot";

function Feature({
	item,
	index,
	onSelectFeature,
	setIndex,
	selectedIndex,
	isLeft = false,
}: {
	item: {
		name: string;
		snippet: string;
		icon: string;
	};
	index: number;
	onSelectFeature: ({
		featureEl,
	}: {
		featureEl: HTMLButtonElement | undefined;
	}) => void;
	selectedIndex: Accessor<number | null>;
	setIndex: Setter<number | null>;
	isLeft?: boolean;
}) {
	let featureEl: HTMLButtonElement | undefined;

	const selected = () => selectedIndex() === index;

	createEffect(() => {
		if (selectedIndex() !== index) return;
		onSelectFeature({ featureEl });
	});

	onMount(() => {
		const resize = new ResizeObserver(() => {
			if (selectedIndex() !== index) return;
			onSelectFeature({ featureEl });
		});

		resize.observe(featureEl as Element);
		onCleanup(() => {
			resize.disconnect();
		});
	});

	return (
		<button
			type="button"
			ref={featureEl}
			class={`flex w-full gap-x-2 lg:max-w-md transition-all duration-500 text-left ${selected() ? "text-black" : ""} ${isLeft ? "lg:justify-end lg:flex-row-reverse ml-auto lg:text-right" : "justify-start mr-auto lg:text-left"}`}
			on:click={() =>
				selectedIndex() === index ? setIndex(null) : setIndex(index)
			}
		>
			<span
				class={`size-8 xl:size-[34px] shadow-[0_0_4px_0_rgba(255,255,255,0.25)] transition-all duration-500 rounded-full grid place-items-center flex-none ${selected() ? "bg-black text-white" : ""}`}
			>
				<span class={`iconify ${item.icon} size-5 xl:size-6`}></span>
			</span>
			<div class="space-y-[2px] xl:space-y-1">
				<p class="lg:text-lg xl:text-xl font-semibold">{item.name}</p>
				<p class="text-sm xl:text-base leading-tight">{item.snippet}</p>
			</div>
		</button>
	);
}

export default function Features() {
	const features = [
		{
			name: "Pet Profile",
			snippet:
				"Add your pets with their names, birthdays, notes, and photos. Everything about them in one place.",
			icon: "material-symbols-light--sound-detection-dog-barking-outline",
		},
		{
			name: "Weight Tracking",
			snippet:
				"Keep an eye on your pet’s health with simple weight logs. Track progress over time and spot changes before they become problems.",
			icon: "material-symbols-light--weight-outline",
		},
		{
			name: "Calendar Events",
			snippet:
				"Add vet visits, grooming sessions, or other important dates to your calendar.",
			icon: "material-symbols-light--calendar-month-outline",
		},
		{
			name: "Food & Feeding History",
			snippet:
				"Add your pets’ foods once, use them to build feeding plans, and track every meal in detailed food logs. Stay on top of your pets’ diet with a clear history of what they eat and when.",
			icon: "material-symbols-light--fastfood-outline",
		},
		{
			name: "Feeding Plans",
			snippet:
				"Create structured feeding schedules for each pet with built-in reminders. Keep your pets on a consistent routine and never miss a meal.",
			icon: "material-symbols-light--calendar-meal-2-outline",
		},
		{
			name: "Backup & Restore",
			snippet:
				"Back up your pet data and bring it with you when you switch devices. Quick, simple, and worry free.",
			icon: "material-symbols-light--settings-backup-restore",
		},
	];

	let wrapper: HTMLDivElement | undefined;

	const [index, setIndex] = createSignal<number | null>(null);
	const [selectedImage, setSelectedImage] = createSignal<string | null>(null);

	const [wrapperRect, setWrapperRect] = createSignal<
		| {
				x: number;
				y: number;
				height: number;
				width: number;
		  }
		| undefined
	>(undefined);

	const [indicatorRect, setIndicatorRect] = createSignal<
		| {
				x: number;
				y: number;
				height: number;
				width: number;
		  }
		| undefined
	>(undefined);

	const half = () => Math.ceil(features.length / 2);
	const leftFeatures = () => features.slice(0, half());
	const rightFeatures = () => features.slice(half());

	const onSelectFeature = ({
		featureEl,
	}: {
		featureEl: HTMLButtonElement | undefined;
	}) => {
		if (!featureEl || !wrapper) return;

		const wrapperRect = wrapper.getBoundingClientRect();
		const rect = featureEl.getBoundingClientRect();

		setIndicatorRect({
			x: rect.x - wrapperRect.x - 15,
			y: rect.y - wrapperRect.y - 15,
			height: rect.height + 30,
			width: rect.width + 30,
		});
	};

	const onPrevButton = () => {
		if (index() === null || index() === 0) {
			setIndex(features.length - 1);
			return;
		}

		const newIndex = index() === 0 ? null : index()! - 1;
		setIndex(newIndex);
	};

	const onNextButton = () => {
		if (index() === null || index() === features.length - 1) {
			setIndex(0);
			return;
		}

		setIndex(index()! + 1);
	};

	onMount(() => {
		const resize = new ResizeObserver(() => {
			if (!wrapper) return;
			const rect = wrapper.getBoundingClientRect();
			const windowWidth = window.innerWidth;
			setWrapperRect({
				x: rect.width / 2,
				y: rect.height / (windowWidth >= 1024 ? 2 : 4),
				height: 0,
				width: 0,
			});
		});

		resize.observe(wrapper as Element);
		onCleanup(() => {
			resize.disconnect();
		});
	});

	return (
		<>
			<Show when={selectedImage()}>
				<Portal>
					<Lightbox
						selectedImage={selectedImage()!}
						setSelectedImage={setSelectedImage}
					/>
				</Portal>
			</Show>

			<div
				ref={wrapper}
				class="container mx-auto grid lg:grid-cols-[1fr_350px_1fr] px-8 gap-x-8 lg:gap-x-4 xl:gap-x-8 relative mb-20 gap-y-8 md:gap-y-10 lg:gap-y-0"
			>
				<div
					class={`absolute bg-white rounded-2xl border-4 border-black shadow-[0_0_5px_2px_rgba(255,255,255,0.25)] transition-all duration-500 ${wrapperRect() === undefined ? "hidden" : ""}`}
					style={{
						left:
							index() === null
								? `${wrapperRect()?.x ?? 0}px`
								: `${indicatorRect()?.x ?? wrapperRect()?.x ?? 0}px`,
						top:
							index() === null
								? `${wrapperRect()?.y ?? 0}px`
								: `${indicatorRect()?.y ?? wrapperRect()?.y ?? 0}px`,
						height:
							index() === null
								? `${wrapperRect()?.height ?? 0}px`
								: `${indicatorRect()?.height ?? wrapperRect()?.height ?? 0}px`,
						width:
							index() === null
								? `${wrapperRect()?.width ?? 0}px`
								: `${indicatorRect()?.width ?? wrapperRect()?.width ?? 0}px`,
					}}
				></div>

				<div class="flex flex-col gap-y-8 z-10 row-2 col-[1/4] md:col-1 lg:row-1 lg:col-1 lg:justify-center">
					<For each={leftFeatures()}>
						{(item, i) => (
							<Feature
								item={item}
								index={i()}
								onSelectFeature={onSelectFeature}
								selectedIndex={index}
								setIndex={setIndex}
								isLeft
							/>
						)}
					</For>
				</div>

				<Screenshot
					index={index}
					onPrevButton={onPrevButton}
					onNextButton={onNextButton}
					setSelectedImage={setSelectedImage}
				/>

				<div class="flex flex-col gap-y-8 z-10 row-3 col-[1/4] md:row-2 md:col-2 lg:row-1 lg:col-3 lg:justify-center">
					<For each={rightFeatures()}>
						{(item, i) => (
							<Feature
								item={item}
								index={i() + half()}
								onSelectFeature={onSelectFeature}
								selectedIndex={index}
								setIndex={setIndex}
							/>
						)}
					</For>
				</div>
			</div>
		</>
	);
}
