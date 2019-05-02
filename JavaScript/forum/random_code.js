$(document).ready(function() {
	(({
		'randomize': function() {
			$('head').append('<style id="st-random-code-script">[class^="st-random-"]{overflow:hidden;}</style>');
			randomList.forEach((randomItem, index) => {
				if($(randomItem.selector).length === 0) return;
				randomItem.randomElements = this.purify(randomItem.randomElements);
				if(randomItem.attribute !== '') {
					randomItem.attribute = window.FFLib.utilities.removeTags(randomItem.attribute, ['script', 'style']);
					try {
						$(randomItem.selector).addClass('st-random-code').attr(randomItem.attribute, this.randomGenerator(randomItem.randomElements));
					}
					catch(e) {
						console.log('[st-random-code '+(index + 1)+'] Errore nell\'inserimento dell\'attributo: ' + e.message);
						return
					}
				}
				else $(randomItem.selector).addClass('st-random-code').append('<div class="st-random-' + (index + 1) + '">' + this.randomGenerator(randomItem.randomElements) + '</div>');
				if(randomItem.changeTime > 0) {
					this.inlineChange(randomItem, index);
				}
			});
		},
		'purify': function(elements) {
			this.weights = 0;
			elements.forEach((elm, i) => {
				elements[i].content = window.FFLib.utilities.removeTags(elm.content, ['script', 'style']);
				this.weights += elm.weight;
			});
			return elements;
		},
		'randomGenerator': function(elements) {
			let inf = 0, rand = Math.random(), code = '';
			for(let elm of elements) {
				if(rand < (inf + elm.weight/this.weights)) {
					code = elm.content;
					break;
				}
				inf += elm.weight/this.weights;
			}
			return code;
		},
		'inlineChange': function(item , index) {
			if(item.attribute !== '') {
				setTimeout(() => {
					$(item.selector).attr(item.attribute, this.randomGenerator(item.randomElements));
					setInterval(() => {
						$(item.selector).attr(item.attribute, this.randomGenerator(item.randomElements));
					}, item.changeTime * 1000);
				}, item.changeTime * 1000);
				return;
			}
			if(item.changeMode.type !== 'none') {
				item.changeMode.speed = item.changeMode.speed * 1000;
				if(item.changeMode.speed <= 0) {
					console.log('[st-random-code '+(index+1)+'] Errore: speed negativa o nulla. Effetto inserito: '+item.changeMode.type+'. Speed inserita: '+item.changeMode.speed+'.');
					return;
				}
			}
			else item.changeMode.speed = 0;
			setTimeout(() => {
				this.changeHtml(item, (index + 1));
				setInterval(() => {
					this.changeHtml(item, (index + 1));
				}, (item.changeTime + item.changeMode.speed * 2 / 1000) * 1000);
			}, item.changeTime * 1000);
		},
		'changeHtml': function(item, number) {
			if(item.changeMode.type === 'none') this.noEffect(item.selector, item.randomElements, number);
			else if(item.changeMode.type === 'fade') this.fadeEffect(item.selector, item.randomElements, item.changeMode, number);
			else if(item.changeMode.type === 'marquee') this.marqueeEffect(item.selector, item.randomElements, item.changeMode, number);
			else if(item.changeMode.type === 'fadmarquee') this.marqueeEffect(item.selector, item.randomElements, item.changeMode, number, 1);
		},
		'noEffect': function(selector, codeList, number) {
			$('.st-random-'+number).remove();
			$(selector).append('<div class="st-random-'+number+'">' + this.randomGenerator(codeList) + '</div>');
		},
		'fadeEffect': function(selector, codeList, options, number) {
			$('.st-random-'+number).fadeOut(options.speed, () => {
				$('.st-random-'+number).remove();
				$(selector).append('<div class="st-random-'+number+'">' + this.randomGenerator(codeList) + '</div>');
				$('.st-random-'+number).hide().fadeIn(options.speed);
			});
		},
		'marqueeEffect': function(selector, codeList, options, number, fade = 0) {
			let start, line, animation = {'start':{}, 'end':{}}, css = {'position':'relative'};
			switch(options.direction) {
				case 'top':
				case 'bottom':
					start = $(selector).outerHeight(true) + 'px'; line = '-' + $('.st-random-'+number).outerHeight(true) + 'px';
					break;
				default:
					start = $(selector).outerWidth(true) + 'px'; line = '-' + $('.st-random-'+number).outerWidth(true) + 'px';
			}
			animation['end'][options.direction] = line;
			animation['start'][options.direction] = 0;
			css[options.direction] = start;
			if(fade) {
				animation['end']['opacity'] = 0;
				animation['start']['opacity'] = 1;
				css['opacity'] = 0;
			}
			$('.st-random-' + number).css('position', 'relative').animate(animation.end, options.speed, () => {
				$('.st-random-'+number).remove();
				$(selector).append('<div class="st-random-'+number+'">' + this.randomGenerator(codeList) + '</div>');
				$('.st-random-'+number).css(css).animate(animation.start, options.speed);
			});
			return;
		}
	})).randomize();
});
