/**
 * Created by sam on 14-10-12.
 */
$(function(){
	var options =
	{
		thumbBox: '.thumbBox',
		spinner: '.spinner',
		imgSrc: ''
	}
	var cropper;
	$('#resume_image_file').on('change', function(){
		var reader = new FileReader();
		reader.onload = function(e) {
			options.imgSrc = e.target.result;
			cropper = $('.imageBox').cropbox(options);
		};
		reader.readAsDataURL(this.files[0]);
		this.files = [];
	});
	$('#btnCrop').on('click', function(){
		var img = cropper.getDataURL();
		$('.cropped').html('<img src="'+img+'">');
		$("#resumeImg").val(img);
	});
	$('#btnZoomIn').on('click', function(){
		cropper.zoomIn();
	});
	$('#btnZoomOut').on('click', function(){
		cropper.zoomOut();
	});
});