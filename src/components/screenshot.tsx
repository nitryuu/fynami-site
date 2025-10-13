import BackupRestore from "@assets/backup-restore.png";
import Calendar from "@assets/calendar.png";
import FeedingPlan from "@assets/feeding-plan.png";
import Food from "@assets/food.png";
import PetProfile from "@assets/pet-profile.png";
import Pets from "@assets/pets.png";
import Weight from "@assets/weight.png";
import { type Accessor, Match, type Setter, Switch } from "solid-js";

enum FEATURES {
	PET_PROFILE = 0,
	WEIGHT = 1,
	CALENDAR = 2,
	FOOD = 3,
	FEEDING_PLAN = 4,
	BACKUP_AND_RESTORE = 5,
}

function CircleBackground() {
	return (
		<div class="absolute h-auto aspect-square max-w-[300px] xs:max-w-[350px] w-full rounded-full bg-gradient-to-b from-[#D9D9D9] to-[#2B60A3]/50 shadow-[0_0_10px_2px_rgba(255,255,255,0.25)]" />
	);
}

function ScreenshotImage({
	src,
	alt,
	setSelectedImage,
}: {
	src: string;
	alt: string;
	setSelectedImage: (value: string) => void;
}) {
	return (
		<img
			src={src}
			alt={alt}
			class="h-[500px] object-contain cursor-zoom-in"
			draggable={false}
			on:click={() => {
				setSelectedImage(src);
				document.body.classList.add("overflow-hidden");
			}}
		/>
	);
}

export default function Screenshot({
	index,
	onPrevButton,
	onNextButton,
	setSelectedImage,
}: {
	index: Accessor<number | null>;
	onPrevButton: () => void;
	onNextButton: () => void;
	setSelectedImage: Setter<string | null>;
}) {
	return (
		<div class="relative grid place-items-center row-[1/2] col-[1/4] lg:row-1 lg:col-2 mb-4 md:mb-0">
			<CircleBackground />

			<div class="grid grid-cols-1 sm:grid-cols-[60px_1fr_60px] w-full place max-w-[350px]">
				<button
					type="button"
					class="-mr-1 transition-colors text-white/50 hover:text-white hidden sm:block"
					on:click={onPrevButton}
				>
					<span class="iconify material-symbols-light--chevron-left text-3xl xs:text-6xl"></span>
				</button>

				<div class="z-10 w-full grid place-items-center">
					<Switch
						fallback={
							<ScreenshotImage
								src={Pets.src}
								alt="Pets"
								setSelectedImage={setSelectedImage}
							/>
						}
					>
						<Match when={index() === FEATURES.PET_PROFILE}>
							<ScreenshotImage
								src={PetProfile.src}
								alt="Pet Profile"
								setSelectedImage={setSelectedImage}
							/>
						</Match>
						<Match when={index() === FEATURES.WEIGHT}>
							<ScreenshotImage
								src={Weight.src}
								alt="Weight"
								setSelectedImage={setSelectedImage}
							/>
						</Match>
						<Match when={index() === FEATURES.CALENDAR}>
							<ScreenshotImage
								src={Calendar.src}
								alt="Calendar"
								setSelectedImage={setSelectedImage}
							/>
						</Match>
						<Match when={index() === FEATURES.FOOD}>
							<ScreenshotImage
								src={Food.src}
								alt="Food"
								setSelectedImage={setSelectedImage}
							/>
						</Match>
						<Match when={index() === FEATURES.FEEDING_PLAN}>
							<ScreenshotImage
								src={FeedingPlan.src}
								alt="Feeding Plan"
								setSelectedImage={setSelectedImage}
							/>
						</Match>
						<Match when={index() === FEATURES.BACKUP_AND_RESTORE}>
							<ScreenshotImage
								src={BackupRestore.src}
								alt="Backup and Restore"
								setSelectedImage={setSelectedImage}
							/>
						</Match>
					</Switch>
				</div>

				<button
					type="button"
					class="-ml-1 transition-colors text-white/50 hover:text-white hidden sm:block"
					on:click={onNextButton}
				>
					<span class="iconify material-symbols-light--chevron-right text-3xl xs:text-6xl"></span>
				</button>
			</div>
		</div>
	);
}
