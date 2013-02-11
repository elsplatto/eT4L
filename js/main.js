$(document).ready(function() {
	
	if ($('#versionNotes li').length > 4) {
		$('#versionNotes li:gt(4)').hide();
		$('#showMoreHolder').show();
		$('#showMoreHolder a').click(function(e){
			e.preventDefault();
			if ($(this).hasClass('active')) {
				$(this).removeClass('active');
				$('#versionNotes li:gt(4)').slideUp('slow');
				$(this).text('Show more');
			}
			else
			{
				$(this).addClass('active');
				$('#versionNotes li:gt(4)').slideDown('slow');
				$(this).text('Show less');
			}
		});	
	}
	
	
	
	$('#chkFilterFree').change(function(){
		if ($(this).is(':checked')) {
			//console.log('checked');
			//$('#priceRangeSection').slideUp('slow');
		}else{
			//console.log('not checked');
			//$('#priceRangeSection').slideDown('slow');
		}
	})
	
	$('.app a.remove').click(function(e) {
		e.preventDefault();
		//ajax removal from database can go here
		//place element removal functionon succes callback
		$(this).closest('section.app').remove();
	});
	
	
	$('#add').live('change',function(){
		var increaseNum, i, lastChildHolder, counter, newCount, newSet, oldString, newString;		
		increaseNum = $(this).val();	
		for (i=0;i<increaseNum;i++)
		{		
			lastChildHolder = $('.formModal #licenseInputs div.holder:last-child');
			counter = parseInt($(lastChildHolder).attr('data-count'));
			newCount = counter+1;
			oldString = '-'+counter;
			newString = '-'+(newCount);		
			newSet = lastChildHolder.clone();	//get a copy of the last div
			$(newSet).attr('data-count',(newCount)); //get the counter
			
			$(newSet).find('div.sbHolder').remove();
			
			
			//change the id and for attributes
			$(newSet).find('label, input, select').each(function(i) {
				var attrString, tagName;
				tagName = $(this).get(0).tagName;
			
				if (tagName.toLowerCase() === 'input' || tagName.toLowerCase() === 'select')
				{
					attrString = $(this).attr('id');
					attrString = attrString.replace(oldString,newString)
					$(this).attr('id',attrString);
					if (tagName.toLowerCase() === 'select')
					{
						//reset selectbox
						$(this).children('option:selected').removeAttr('selected');
					}
					else
					{
						//reset input field
						$(this).val('');
					}
				}
				else if (tagName.toLowerCase() === 'label')
				{
					attrString = $(this).attr('for');
					attrString = attrString.replace(oldString,newString)
					$(this).attr('for',attrString);
				}
				$('#licenseInputs').append(newSet);
				//style selectbox element
				$(newSet).find('select').selectbox();
				//reselt styled selectbox element
				$(newSet).find('.sbSelector').text('1');
				
			});				
		}		
	});
	
	$('#submitLicense').live('click',function(e) {
		e.preventDefault();
		$('.licenseOverlayHolder').html('');
		$('.licenseOverlayHolder').load('overlays/license-confirm.html');
	});
	
	$('.licensePurchaseInfo, .licenseInfo').live('click',function(e) {
		e.preventDefault();
		//$('.licenseOverlayHolder').html('');
		//$('.licenseOverlayHolder').load($(this).attr('href'));
		$.ajax({
		  url:$(e.target).attr('href')
		}).done(function(data){
			$('.licenseOverlayHolder').html(data);
		});
	});
	
	$('a.enterLicense, a.getSoftware, a.buyLicense').each(function(i) {
		$(this).qtip(
		{
			style: {
				classes: 'formModal'
			},
			content: {
				text: '<img class="throbber" src="img/loading.gif" alt="Loading..." /><span>Loading...</span>',
				title: {
					button: 'Close'
				},
				ajax: {
					type: 'GET',
					url: $(this).attr('href'),
					success: function(data, status) {
						// Process the data
						//console.log('here')
						// Set the content manually (required!)
						this.set('content.text', data);
						$('a.cancel').live('click', function(e){
							e.preventDefault();	
							$('.qtip-close').trigger('click');
						});
						$('.licenseOverlayHolder select').selectbox();
					},
					once:false
				}
			},
			position: {
				my: 'center', // ...at the center of the viewport
				at: 'center',
				target: $(window)
			},
			show: {
				event: 'click', // Show it on click...
				solo: true, // ...and hide all other tooltips...
				modal: true // ...and make it modal
			},
			hide: false
		});
	}).click(function(event) 
		{ 
			event.preventDefault(); 
		});;

	
	$('a.viewInfo').each(function(i)
	{
		var triggerElTop, triggerElLeft, targetElLeft, finalOffset;
		
		// We make use of the .each() loop to gain access to each element via the "this" keyword...
		$(this).qtip(
		{
			style: {
				classes: 'qtip-preview'
			},
			show: {
				event: 'click'
			},
			hide: {
				event: 'unfocus'
			},			
			events: {
				show: function(event, api) {
					
					triggerElLeft = $(event.originalEvent.currentTarget).offset().left - 120;
					triggerElTop = $(event.originalEvent.currentTarget).offset().top + 15;
					targetElLeft = $('#contentArea').offset().left + 10;
					
					api.options.style.tip.width = 20,
					api.options.style.tip.height = 40;
					api.options.style.tip.offset = triggerElLeft;
					
					api.options.position.viewport = $(window);
					api.options.position.target = [targetElLeft,triggerElTop];
					api.options.position.adjust.x = triggerElLeft;
					
				}
			},
			
			
			content: {
				// Set the text to an image HTML string with the correct src URL to the loading image you want to use
				text: '<img class="throbber" src="img/loading.gif" alt="Loading..." />',
				title: {
					button: 'Close'
				},
				ajax: {
					type: 'GET',
					url: $(this).attr('href'),
					once:false,
					success: function(data, status) {
						// Process the data
						//console.log('here')
						// Set the content manually (required!)
						this.set('content.text', data);
						$('.previewGallery').nivoSlider({
							effect: 'slideInLeft',
							pauseTime: 6000,
							startSlide: 0
						});
					}
				}
			}
		})
	}).click(function(event) 
		{ 
			event.preventDefault(); 
		});

	
	if ($('#licenseHelp').length > 0)
	{	
		$('#licenseHelp').qtip({
			content: {
				text: 'You can find and download software through DEC but need to buy the license directly from the publisher.<hr/><a href="#">Read the license help.</a>'
			},
			position: {
					my: 'top center',  // Position my top left...
					at: 'bottom center' // at the bottom right
			},
			hide: {
				event: 'unfocus'
			},
			style: {
				width: '300px',
				classes: 'license-tip',
				tip: {
					width: 26,
					height:13
				}
			}
		});
	}
	
	$('#filterArea input[type="reset"]').click(function(){
		$('a.sbSelector').text('Select');
		$('#priceSlider').slider('values',[0,1000]);
		$('#filterLearningArea2').selectbox('disable');
		$('#filterLearningArea3').selectbox('disable');
		$('section.app:hidden').show();
	});
	
	$('#priceSlider').slider({
		range: true,
		min: 0,
		max: 1000,
		values: [ 100, 800 ],
		slide: function( event, ui ) {
			$('#amount-1').val( ui.values[ 0 ]);
			$('#amount-2').val(ui.values[ 1 ] );
		}
	});	
	
	$('#amount-1').val(100);
	$('#amount-2').val(800);
	
	
	$('#amount-1, #amount-2').keyup(function(){
		 $("#priceSlider").slider("option" , "values", [$('#amount-1').val(),$('#amount-2').val()])
	});
	
	$('.styledSelect select').selectbox({
		onChange: function(val, inst) {
			console.log('val: ' + val);
			$('section.app').each(function(i){
				console.log(i);
				var dataKeywords = $(this).attr('data-keywords');
				if (dataKeywords !== undefined)
				{
					console.log('keywords: '+dataKeywords);
					console.log('val: '+val);
					console.log('index:'+dataKeywords.toLowerCase().indexOf(val.toLowerCase()));
					if (dataKeywords.toLowerCase().indexOf(val.toLowerCase()) > -1) {
						$(this).show();
					}
					else
					{
						$(this).hide();
					}
				}
				else
				{
					$(this).hide();
				}
			});
		}
	});
	$('#filterLearningArea2').selectbox();
	$('#filterLearningArea2').selectbox('disable');
	$('#filterLearningArea3').selectbox();
	$('#filterLearningArea3').selectbox('disable');
	$('#filterLearningArea1, #filterLearningArea2').selectbox({
		onChange: function (val, inst) {
			fetchSubCats($(this));			
		}
	});
	
	function fetchSubCats(obj) {
		var selectedVal, jsonPath, targetEl, parentId, blnDynamic, targetListSuffix, targetList, targetGrandChildEl, targetGrandChildId, blnHasGrandChild;
		var targetGrandChildListSuffix, targetGrandChildList;
		blnDynamic = false;
		blnHasGrandChild = false;
		parentId = parseInt('0'+$(obj).attr('data-parentId'));
		selectedVal = parseInt('0'+$(obj).val());
		jsonPath = $(obj).attr('data-jsonPath');
		targetEl = $('#'+$(obj).attr('data-target'));
		targetListSuffix = $(targetEl).attr('sb');
		targetList = $('#sbOptions_'+targetListSuffix);
		targetGrandChildId = $(targetEl).attr('data-target');
		targetGrandChildEl = $('#'+targetGrandChildId);
		
		$(obj).children('option:selected').removeAttr('selected');
		
		if (typeof targetGrandChildId !== undefined && typeof targetGrandChildId === 'string') {
			blnHasGrandChild = true;
			targetGrandChildListSuffix = $(targetGrandChildEl).attr('sb');
			targetGrandChildList = $('#sbOptions_'+targetGrandChildListSuffix);
		}
		
		$.getJSON(jsonPath, function(data) {
			var i,j,k,selectBoxHtml, listHtml;
			selectBoxHtml ='<option value="">Select</option>';		
			listHtml = '<li><a href="#Select" rel="Select" class="sbFocus">Select</a></li>';
			if (selectedVal > 0)
			{
				for (i=0;i<data.parentCategories.length;i++)
				{
					if ((data.parentCategories[i]['parentId'] === selectedVal) || (data.parentCategories[i]['parentId'] === parentId)) 
					{	
						for (j=0;j<data.parentCategories[i].categories.length;j++)
						{						
							if ((data.parentCategories[i].categories.length > 0) && (data.parentCategories[i]['parentId'] === selectedVal))
							{
								blnDynamic = true;
								selectBoxHtml += '<option value="'+data.parentCategories[i].categories[j].id+'">'+data.parentCategories[i].categories[j].label+'</option>';
								listHtml += '<li><a href="#'+data.parentCategories[i].categories[j].id+'" rel="'+data.parentCategories[i].categories[j].id+'" class="">'+data.parentCategories[i].categories[j].label+'</a></li>'
							}
							else if ((data.parentCategories[i].categories[j].id === selectedVal) && (data.parentCategories[i].categories[j].subCategories !== undefined)) 
							{							
								for (k=0;k<data.parentCategories[i].categories[j].subCategories.length;k++)							
								{
									blnDynamic = true;
									selectBoxHtml += '<option value="'+data.parentCategories[i].categories[j].subCategories[k].id+'">'+data.parentCategories[i].categories[j].subCategories[k].label+'</option>';
									listHtml += '<li><a href="#'+data.parentCategories[i].categories[j].subCategories[k].id+'" rel="'+data.parentCategories[i].categories[j].subCategories[k].id+'" class="">'+data.parentCategories[i].categories[j].subCategories[k].label+'</a></li>'
								}
							}
						}					
					}
				}
			}			
			
			if (blnDynamic) {
				//has chidren to add to dropdown
				$(targetEl).removeAttr('disabled');
				$(targetEl).attr('data-parentId',selectedVal)
				$(targetEl).html('');

				$(targetEl).selectbox('detach'); //detach selecbox plugin
				$(targetEl).append(selectBoxHtml);//add new options
				$(targetList).html(listHtml);
				$(targetEl).selectbox({
					onChange: function (val, inst) {
						fetchSubCats($(this));
					}
				});
				if (blnHasGrandChild)
				{
					//reset grandchild
					$(targetGrandChildEl).append(selectBoxHtml);
					$(targetGrandChildEl).html('');	
					$(targetGrandChildEl).html(listHtml);
					$(targetGrandChildEl).attr('disabled','disabled');
					$(targetGrandChildEl).selectbox('disable');
				}
			}
			else
			{
				//reset child
				$(targetEl).attr('disabled','disabled');
				$(targetEl).selectbox('disable');
				$(targetEl).append(selectBoxHtml);	
				$(targetList).html(listHtml);
				$('#sbSelector_'+targetListSuffix).text('Select');
				if (blnHasGrandChild)
				{
					//reset grandchild
					$(targetGrandChildEl).append(selectBoxHtml);
					$(targetGrandChildList).html(listHtml);
					$('#sbSelector_'+targetGrandChildListSuffix).text('Select');
					$(targetGrandChildEl).html('');	
					$(targetGrandChildEl).html(listHtml);
					$(targetGrandChildEl).attr('disabled','disabled');
					$(targetGrandChildEl).selectbox('disable');
				}
			}
		}).success(function() {			
				
		}).complete(function() {
			//console.log('complete');
		}).error(function(textStatus, jqXHR) {
			//console.log(textStatus)
			//console.log('error');
		})
	}
	
	$('#screenshotNav .images, #screenshotNav .videos').click(function() {
		var activeBtn, nonActiveBtn, targetEl, nonTargetEl;
		activeBtn = $(this);
		nonActiveBtn = $(activeBtn).siblings('button');
		targetEl = $('#' + $(activeBtn).attr('data-target'));
		nonTargetEl = $('#' + $(nonActiveBtn).attr('data-target'));
		
		if (!$(activeBtn).hasClass('on')) {
			$(activeBtn).addClass('on');
			$(nonActiveBtn).removeClass('on');
			$(targetEl).show();
			$(nonTargetEl).hide();
		}
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
