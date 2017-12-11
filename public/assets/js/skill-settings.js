(function($) {
    $.fn.getAttributes = function() {
        var attributes = {}

        if( this.length ) {
            $.each( this[0].attributes, function( index, attr ) {
                attributes[ attr.name ] = attr.value
            } )
        }

        return attributes
    }
})(jQuery)

$(document).ready(function(){
	if ( ! $("#pie-container").length ){
		return
	}

	$.ajax({
        type: 'GET',
        url: '/json/skillsets.json',
        dataType: 'json',
        success: function( data, textStatus, jqXHR ){
           	//console.log('Skillsets:',data)

           	manageSkills( data )
        },
        error: function( jqXHR, textStatus, errorThrown ){
            console.error('Failed to get skillset data: %s', textStatus, errorThrown)
        }
    })
})

/**
 * Replace an element with a copy of itself, changing only the content of said element
 *
 * @param 	{string|jQuery} 	element 	Either a jQuery selector, or a jQuery object
 * @param 	{string|number} 	newContent	New HTML content for replacement element
 * @param 	{object} 			addAttrs 	Any additional attributes to add
 * @param 	{string} 			speed 		Speed to fade the elements in/out (default: fast)
 *
 * @example // Replace the value in #item-title with 'New Title'
 * 	fadeReplace( '#item-title', 'New Title' )	
 *
 * @example // Same thing, but use a jQuery object, and add a 'date-updated' attribute with the current date
 * 	fadeReplace( $('#item-title'), 'New Title', { 'data-updated': new Date().toString() } )	
 */
function fadeReplace( element, newContent, addAttrs, speed ){
	var $element

	if( element instanceof jQuery ){
		$element = element
	}
	else if( typeof element === 'string' ) {
		$element = $( element )
	}
	else {
		console.error( 'Invalid or undefined element or element selector value provided' )
		return
	}

	if( $element.length === 0 ){
		console.error( 'No elements found using the selector provided' )
		return
	}

	var tag 	 = $element.prop('tagName')
	var attrs 	 = $element.getAttributes()
	var selector = $element.selector

	if( $.isPlainObject( addAttrs ) ){
		attrs = $.extend( attrs, addAttrs )
	}

	if( typeof speed !== 'string' ){
		speed = 'fast'
	}

	attrs.html = newContent

	$element.fadeOut( speed, function(){
		var newElement = $( '<' + tag + '/>', attrs ).hide()

		$( this ).replaceWith( newElement )

		$( selector ).fadeIn( speed )
	})
}

function manageSkills( skillGroups ){
	_initGroups( skillGroups )

	$(document).on( 'click', '.btn-skills', function(e){
		e.preventDefault()

		var $lastActive = $('.btn-skills.active')

		// If there was an active button, then deactivate it (by removing the active class)
		if( $lastActive.length ){
			$lastActive.removeClass('active')
		}

		var $this = $(this)
		var skill = $this.data('skill')

		$this.addClass('active')

		_initGroup( skill )
	})

	/**
	 * Validate the skill group structure.
	 * Validations:
	 * 		1) skillGroups is defined (not falsey)
	 * 		2) skillGroups is a populated array
	 * 		3) each group in skillGroups has a 'category' property, defined as a string
	 * 		4) each group has an 'items' property, defined as a populated array
	 *
	 * @param 	{array} 	skillGroups 			Array of skillsets
	 * @param 	{object}	skillGroups[] 			A skill set
	 * @param	{string} 	skillGroups[].category 	Skill group category name
	 * @param 	{array} 	skillGroups[].items 	Skill group items
	 * @returns {boolean}
	 */
	function _validateGroups( skillGroups ){
		if( ! skillGroups ) return false

		if( ! $.isArray( skillGroups ) || skillGroups.length === 0 ) return false

		var loopResult = true

		$.each( skillGroups, function( i, grp ){
			if( typeof grp.category !== 'string' || grp.category.length === 0 ){
				loopResult = false
				return
			}

			if( typeof grp.items === 'undefined' || ! $.isArray( grp.items ) || grp.items.length === 0 ){
				loopResult = false
				return
			}
		})

		if( ! loopResult ) return false

		return true
	}

	/**
	 * This function looks through the skill groups and creates a link in the 
	 * skill chart for each
	 */
	function _initGroups( skillGroups ){
		if( ! _validateGroups( skillGroups ) ){
			console.error( 'Skill group validation failed' )
			return false
		}

		//console.debug('initGroups', skillGroups)

		var $skillButtonContainer = $('nav.slide-effect')
		var $skillContainer = $('div#pie-container > div#l-inhalt')
		var btnClasses = [ 'btn-skills' ]

		$("#l-inhalt").css("visibility", "visible")

		$.each( skillGroups, function( idx, grp ){
			//console.log('Idx %s: ', idx, grp)

			if( idx > 0 ){
				btnClasses.push( 'l-rMargin-' + ( 20 * idx ) )
			}

			$skillButtonContainer.append(
				$('<a/>', {
					href: '#',
					'data-hover': grp.category,
					'data-skill': grp.category,
					class: btnClasses.join(' ')
				})
				.append(
					$('<span/>').text(grp.category)
				)
			)
		})

		_initGroup()
		//<a href="#" data-hover="Design" data-skill="design" class="btn-skills"><span>Design</span></a>
	}

	function _initGroup( skill ){
		//console.debug('initGroup', skill)

		var skillIndex = {}

		$.each( skillGroups, function( idx, grp ){
			skillIndex[ grp.category.toLocaleLowerCase() ] = idx
		})

		//console.log('skillIndex:',skillIndex)
		var $skillButtonContainer = $('nav.slide-effect')
		var $skillContainer = $('div#pie-container > div#l-inhalt')

		_clearBars()

		if( typeof skill === 'undefined' ){
			skill = Object.keys(skillIndex)[0]
		}

		skill = skill.toLocaleLowerCase()

		if( typeof skillIndex[ skill ] === 'undefined' ){
			console.error('No skill named %s', skill)
			return
		}

		if( typeof skillGroups[ skillIndex[ skill ] ] === 'undefined' ){
			console.error('No skill named %s', skill)
			return
		}

		var skillInfo = skillGroups[ skillIndex[ skill ] ]


		//$('#skill-category-title').html( skillInfo.category )
		//$('#skill-category-summary').html( skillInfo.summary )

		/*
		$('#skill-category-title').fadeOut("fast", function(){
			var newElement = $("<h2/>", {
				id: 'skill-category-title',
				class: 'sub-heading uppercase',
				html: skillInfo.category
			}).hide()

			$(this).replaceWith( newElement );
			$('#skill-category-title').fadeIn("fast");
		})

		$('#skill-category-summary').fadeOut("fast", function(){
			var newElement = $("<h2/>", {
				id: 'skill-category-summary',
				class: 'weight-300 font-alter text-light-dark',
				html: skillInfo.summary
			}).hide()

			$(this).replaceWith( newElement );
			$('#skill-category-summary').fadeIn("fast");
		})
		*/

		fadeReplace( '#skill-category-title', skillInfo.category )
		fadeReplace( '#skill-category-summary', skillInfo.summary )


	    $skillContainer.css("visibility", "visible").addClass('show')

		$.each( skillInfo.items, function( idx, skl ){
			//console.log('idx:',idx)
			//console.log('skl:',skl)

			$skillContainer
				.append(
					$('<div/>', {
						id: 'skill-bar' + (idx + 1), 
						class: 'skill-item bar bar' + (idx + 1),
						'data-percent': skl.value,
						css: {
							height: '',
							backgroundColor: skillInfo.colors.primary,
							borderRight: skillInfo.colors.secondary + ' solid 5px',
							left: ( idx === 0 ? 0 : (50 * idx) + 'px')
						}
					})
					.append( 
						$('<h5/>', { 
							class: 'skill-caption', 
							html: skl.title
						})
					)
				)
		} )

		_growSkillItems()

		//updateBars( skillData[ skill ] )

		//div#pie-container > div#l-inhalt $('<div/>').attr({ id: '', class: ''})  $('<div/>').attr({ id: 'test', class: 'idk'}).append( $('<h5/>').addClass('skill-caption').html('&nbsp;') )[0] 
	}

	

	function _growSkillItems(){
		$('.skill-item').each( function( idx, item ){
			//console.log('Growing skill item #%s', idx, item)
			$(item).css('height',$(item).data('percent') )
		})
	}

	function _clearBars(data) {
		//console.debug('clearBars', data)

		$('.skill-item').each( function( idx, item ){
			//console.log('Growing skill item #%s', idx, item)
			//$(item).css('height','' )
			$(item).remove()
		})
		return

		//$('div.skill-item')
		$('div#pie-container > div#l-inhalt > div.skill-item').remove()
		return

	    for (var i = 0; i < data.length; i = i + 1) {
	        var j = i + 1
	        eval("document.getElementById('skill-bar" + j + "').style.height = '';")
	        eval("document.getElementById('skill-bar" + j + "').style.backgroundColor = 'transparent';")
	        eval("document.getElementById('skill-bar" + j + "').style.borderRight = 'none';")
	        document.querySelector("#skill-bar" + j + " > .skill-caption").innerHTML = ""
	    }
	}
}