$(document).ready(function() {	
	
	$('select#filterLearningArea1,select#filterLearningArea2').change(function(){		
		var selectedVal, jsonPath, targetEl, parentId, blnDynamic;
		blnDynamic = false;
		parentId = parseInt('0'+$(this).attr('data-parentId'));
		selectedVal = parseInt('0'+$(this).val());
		jsonPath = $(this).attr('data-jsonPath');
		targetEl = $('#'+$(this).attr('data-target'));			
		$.getJSON(jsonPath, function(data) {
			var i,j,k,html;
			html ='<option value="">Select</option>';			
			for (i=0;i<data.parentCategories.length;i++)
			{
				if ((data.parentCategories[i]['parentId'] === selectedVal) || (data.parentCategories[i]['parentId'] === parentId)) 
				{					
					for (j=0;j<data.parentCategories[i].categories.length;j++)
					{						
						if (parentId === 0) 
						{
							blnDynamic = true;
							html += '<option value="'+data.parentCategories[i].categories[j].id+'">'+data.parentCategories[i].categories[j].label+'</option>';
						}
						else if ((data.parentCategories[i].categories[j].id === selectedVal) && (data.parentCategories[i].categories[j].subCategories !== undefined)) 
						{				
							for (k=0;k<data.parentCategories[i].categories[j].subCategories.length;k++)							
							{
								blnDynamic = true;
								html += '<option value="'+data.parentCategories[i].categories[j].subCategories[k].id+'">'+data.parentCategories[i].categories[j].subCategories[k].label+'</option>';
							}
						}
					}
					if (blnDynamic) {
						$(targetEl).removeAttr('disabled');
					}
					else
					{
						$(targetEl).attr('disabled','disabled');
					}
					$(targetEl).attr('data-parentId',selectedVal)
					$(targetEl).html('');
					$(targetEl).append(html);					
				}
			}	
			
			
		}).success(function() {			
			console.log('success');
		}).complete(function() {
			console.log('complete');
		}).error(function(textStatus, jqXHR) {
			console.log(textStatus)
			console.log('error');
		})
	});
	
	$('a.viewInfo').click(function(e) {
		e.preventDefault();
		
		$.get(this.href, function(html) {
		    $(html).prependTo('body').modal();
		  }).success(function() {
			$('#previewGallery').nivoSlider({
				effect: 'slideInLeft',
				pauseTime: 6000,
				startSlide: 0
			});
		});
		
	});
	
	if ($('#primaryNav ul li.active').length) {
		$('#primaryNav ul').prepend('<li class="bg"></li>');
		var activeEl, bgEl, bgLeftPos, bgWidth, nextSib;
		activeEl = $('#primaryNav ul li.active');
		bgEl = $('#primaryNav ul li.bg');
		bgLeftPos = activeEl.position().left;
		bgWidth = activeEl.outerWidth() + 23;
		nextSib = activeEl.next('li');
		bgEl.css({
			left: bgLeftPos,
			width: bgWidth,
			display: 'list-item'
		})
		nextSib.css({
			borderLeftColor: 'transparent',
		})
		activeEl.css({
			backgroundColor: 'transparent',
			border: 'none'
		})
	}	
	
	$('#viewByList').click(function(e) {
		e.preventDefault();
		$('#viewByThumb').removeClass('on');
		$(this).addClass('on');
		$('#contentArea').removeClass('thumbnails');
		$('#contentArea').addClass('list');
		window.location.hash = '#list';
	});
	
	$('#viewByThumb').click(function(e) {
		e.preventDefault();
		$('#viewByList').removeClass('on');
		$(this).addClass('on');
		$('#contentArea').removeClass('list');
		$('#contentArea').addClass('thumbnails');
		window.location.hash = '#thumbnails';
	});
	
	var appsView = window.location.hash.replace('#','').toLowerCase();
	
	
	if (appsView == 'list')
	{
		$('#viewByThumb').removeClass('on');
		$('#viewByList').addClass('on');
		$('#contentArea').removeClass('thumbnails');
		$('#contentArea').addClass('list');
	}
	else
	{
		$('#viewByList').removeClass('on');
		$('#viewByThumb').addClass('on');
		$('#contentArea').removeClass('list');
		$('#contentArea').addClass('thumbnails');
	}
	
	$('#btnDetails').click(function(e){
		e.preventDefault();
		var parentLI = $(this).parent('li');
		if (parentLI.hasClass('on')) {
			parentLI.removeClass('on');
		}
		else{
			parentLI.addClass('on');
		}
	});
	
	$('#detailsContainer input[type="checkbox"]').change(function() {		
		if ($(this).is(':checked'))
		{
			$('.app div.'+$(this).val()).show();
		}
		else
		{
			$('.app div.'+$(this).val()).hide();
		}
	});
	
	$('input[type="checkbox"].styled').change(function() {
		var label = $(this).parent('label');
		if ($(this).is(':checked'))
		{
			label.removeClass('boxUnChecked');
			label.addClass('boxChecked');
		}
		else
		{
			label.removeClass('boxChecked');
			label.addClass('boxUnChecked');
		}
	});
	
	$('a.toggleClass').click(function(e){
		e.preventDefault();
		var targetEl = $($(this).attr('href'));
		var parentEl = $(this).parent('div');
		if (!parentEl.hasClass('on')) 
		{	
			showFilter(parentEl, targetEl);			
		}
		else
		{
			hideFilter(parentEl, targetEl);
		}
	});
	
	$('#toFilters').click(function(e){
		var targetEl = $($(this).attr('href'));
		var parentEl = $('#filterTab');
		if (!parentEl.hasClass('on'))
		{
			parentEl.addClass('on');
			targetEl.slideDown('slow');
		}
	});
	
	function showFilter(parentEl, targetEl) {
		parentEl.addClass('on');
		targetEl.slideDown('slow');
		if ($('#specialFeatures').is('*')) {
			$('#specialFeatures').hide();
		}
	}
	
	function hideFilter(parentEl, targetEl) {
		parentEl.removeClass('on');
		targetEl.slideUp('slow');
		if ($('#specialFeatures').is('*')) {
			$('#specialFeatures').show();
		}
	}
	
	$('#filterHeader a').click(function(e) {
		e.preventDefault();
		window.location.hash = '';
		hideFilter($('#filterTab'), $('#filterArea'));
	});
	
	$.each($('input[type="checkbox"].styled'), function(i){
		var label = $(this).parent('label');
		if ($(this).is(':checked'))
		{
			label.removeClass('boxUnChecked');
			label.addClass('boxChecked');
		}
		else
		{
			label.removeClass('boxChecked');
			label.addClass('boxUnChecked');
		}
	});
	
});
