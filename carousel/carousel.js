class MyCarousel {
	constructor(el) {
		this.element = el;
		this.directionControls = this.element.querySelectorAll(
			'button[data-carousel-direction]'
		);
		this.jumpControls = this.element.querySelectorAll(
			'input[data-carousel-element=radio]'
		);
		this.autoplayControl = this.element.querySelector(
			'button[data-carousel-autoplay]'
		);

		this.init();
	}

	init() {
		const changeEvent = new Event('change');
		const clickEvent = new Event('click');

		this.directionControls.forEach((button) => {
			button.addEventListener('click', (event) => {
				const button = event.target;
				const carouselId = button.getAttribute('data-carousel-id');
				const direction = button.getAttribute('data-carousel-direction');
				const allSlides = this.element.querySelectorAll(
					`input[name=${carouselId}]`
				);
				const currentIndex = Math.max(
					[...allSlides].findIndex(
						(jumpControl) => jumpControl.checked === true
					),
					0
				);
				const maxIndex = allSlides.length - 1;
				const nextIndex =
					direction === 'previous'
						? currentIndex < 1
							? maxIndex
							: currentIndex - 1
						: currentIndex >= maxIndex
						? 0
						: currentIndex + 1;
				const nextSlide = allSlides[nextIndex];

				nextSlide.checked = true;
				nextSlide.dispatchEvent(changeEvent);
			});
		});

		this.jumpControls.forEach((button) => {
			button.addEventListener('change', (event) => {
				const currentRadio = event.target;
				const currentRadioName = currentRadio.getAttribute('name');
				const currentPanelId = `#${currentRadio.getAttribute('value')}_panel`;

				this.element
					.querySelectorAll(`[name='${currentRadioName}']`)
					.forEach((radio) => {
						const panelId = `#${radio.getAttribute('id')}_panel`;
						const panel = this.element.querySelector(panelId);

						if (currentPanelId === panelId) {
							panel.style.display = '';
						} else {
							panel.style.display = 'none';
						}
					});
			});
		});

		setInterval(() => {
			if (this.autoplayControl.getAttribute('aria-pressed') === 'true') {
				this.element
					.querySelector('[data-carousel-direction=next]')
					.dispatchEvent(clickEvent);
			}
		}, 5000);

		this.autoplayControl.addEventListener('click', (event) => {
			const toggle = event.target;
			const autoplayState =
				toggle.getAttribute('aria-pressed') !== 'true' ? 'true' : 'false';

			toggle.setAttribute('aria-pressed', autoplayState);
		});
	}
}

const carousels = [];

document
	.querySelectorAll('[data-carousel]')
	.forEach((element) => carousels.push(new MyCarousel(element)));
