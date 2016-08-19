var componentDefList= jsonData.getComponentDefList();


	// 1. ComponentDef
	// 2. ConfigDefNode
	// 	-- 1 and 2 can store all the information in componentDefList

	// 3. ComponentInput
	// 4. ConfigInputNode


var ComponentDef = function (className){
	var component = componentDefList[className];

	this.class_name=component.class_name;
	this.display_name=component.display_name;
	this.description=component.description;
	this.configList=[];
	for (var i in component.config){
		this.add(new ConfigDefNode(component.config[i],this));
	}
}

ComponentDef.prototype ={
	add: function(child){
        this.configList.push(child);
	}
}


var ConfigDefNode = function (config,parent){
	this.internal_name = config.internal_name||'';
	this.display_name = config.display_name||'';
	this.description = config.description||'';
	this.type = config.type; //fred check predefined 
	this.mandatory = config.mandatory;
	this.max = config.max; // fred check max >= min, what type have min max
	this.min = config.min;
	this.possible_values = config.possible_values||'';// fred values
	this.minimum_occurrence = config.minimum_occurrence;
	this.maximum_occurrence = config.maximum_occurrence;
	this.parent=parent;
	this.allow_null=config.allow_null||false;
	this.children = [];

	if (config.children!=null){
		var children_length = config.children.length;
		for (var i=0;i<children_length;i++){
			this.add(new ConfigDefNode(config.children[i],this));	
		}
	}
}

ConfigDefNode.prototype = {
    add: function (child) {
        this.children.push(child);
    },
    hasChildren: function () {
        return this.children.length > 0;
    },
}



var ComponentInput = function (componentDef,globalRootId){
	this.componentDef = componentDef;
	this.id = globalRootId;
	this.htmlText ='';
	this.configList=[];

	configMap.set(this.id,this);
	this.createTree();
	this.generateHtml();
}

ComponentInput.prototype ={
	add: function(child){
        this.configList.push(child);
	},
	createTree: function(){
		for (var i in this.componentDef.configList){
			this.add(new ConfigInputNode(this.componentDef.configList[i],this));
		}		

	},
	generateHtml: function(){

		var htmlText ='';

		// Component Class
		// $('#'+this.id).append('<div class="form-group"><label>Class:'+this.class_name+'</label></div>');
		htmlText += '<div class="form-group"><label>Class:'+this.componentDef.class_name+'</label></div>';
		
		// Description
		// $('#'+this.id).append('<div class="form-group"><label>Description:'+this.description+'</label></div>');
		htmlText += '<div class="form-group"><label>Description:'+this.componentDef.description+'</label></div>';

		// Component Name
		// $('#'+this.id).append('<h3>Please input the name for your Component here</h3>');
		htmlText += '<h3>Please input the name for your Component here</h3>';

		htmlText += '<div class="form-inline row">';
		htmlText += '<label class="col-sm-1">Name: </label>';
		htmlText += '<input type="text" class="form-control width-specific" id="Component_name" name="Component_name"></input></div>';
		// $('#'+this.id).append(temp);

		// $('#'+this.id).append('<h3>Please input the config for Component here</h3>');
		htmlText += '<h3>Please input the config for Component here</h3>';

		// $('#'+this.id).append('<hr>');
		htmlText += '<hr>';

		this.htmlText = htmlText;

	},
	appendDOM: function(){
		$('#'+this.id).empty();
		$('#'+this.id).append(this.htmlText);

		for (var i in this.configList){
			this.configList[i].appendDOM();
			// this.add(new ConfigInputNode(this.componentDef.configList[i],this));
		}	

	},
	toJson: function(){
		var result={};
		result['name'] = $('#Component_name').val();
		result['class_name'] = this.componentDef.class_name;
		result['config'] = {};

		for (var i=0; i<this.configList.length;i++){
			var currTree = this.configList[i];
			result.config[currTree.configDefNode.internal_name] = currTree.toJson();
		}

		return result;
	},
	validateInput: function(){
		// validateInput
		var validate_result = true;
		var re=/^\s*$/; 	
	    if (re.test($('#Component_name').val())){
		// if ($('#Component_name').val()==''){
	    	// htmlText+= ' <input type="text" class="form-control" placeholder="'+this.configDefNode.description+'" data-toggle="tooltip" data-placement="top" title="Tooltip on top">';
	    	// htmlText+= ' <i class="form-control-feedback glyphicon glyphicon-remove" data-fv-icon-for="message" style=""></i>';
	    	// htmlText+= ' <span class="for_validation glyphicon glyphicon-ok text-success"></span>';
	    	// htmlText+= ' <span class="for_validation glyphicon glyphicon-remove text-danger"></span>';

	    	// .removeAttribute("class");
	    	// setAttribute("target", "_self");

	    	// $('[data-toggle="tooltip"]').tooltip()
	    	// result = $('#'+this.id).find('input').val();
	    	// $('#Component_name')[0].setAttribute("data-toggle", "tooltip");
	    	// $('#Component_name')[0].setAttribute("data-placement", "top");
	    	// $('#Component_name')[0].setAttribute("title", "Cannot be empty");
	    	// var htmlText+= ' <span class="for_validation glyphicon glyphicon-ok text-success"></span>';

	    	var displayResult = ' <span class="for_validation glyphicon glyphicon-remove text-danger"></span>';
	    	$('#Component_name').parent().append(displayResult);
	    	var htmlText = '<small class="for_validation form-text text-muted"> *Cannot be empty </small>';
	    	$('#Component_name').parent().append(htmlText);
	    	validate_result = false;
		}
		else{
			var displayResult = ' <span class="for_validation glyphicon glyphicon-ok text-success"></span>';
    		$('#Component_name').parent().append(displayResult);
		}
		for (var i=0; i<this.configList.length;i++){
			var currTree = this.configList[i];
			validate_result=currTree.validateInput()&&validate_result;
		}

		return validate_result;
	}
}



var ConfigInputNode = function (configDefNode,parent){
	this.configDefNode = configDefNode;
	this.id = ++globalId;
	this.htmlText = '';
	this.parent = parent;
	this.children = [];

	configMap.set(this.id,this);
	this.createTree();
	this.generateHtml();
}

ConfigInputNode.prototype = {
    add: function (child) {
        this.children.push(child);
    },
    remove: function (child) {
        var length = this.children.length;
        for (var i = 0; i < length; i++) {
            if (this.children[i] === child) {
                this.children.splice(i, 1);
                return;
            }
        }
    },
    detachFromMap: function(){
    	configMap.delete(this.id);	
		if (this.hasChildren){
			var children_length = this.children.length;
			for (var i=0;i<children_length;i++){
				this.children[i].detachFromMap();
			}
		}
    },
    hasChildren: function () {
        return this.children.length > 0;
    },
    createTree: function(){
		if (this.configDefNode.hasChildren){
			var children_length = this.configDefNode.children.length;
			for (var i=0;i<children_length;i++){
				this.add(new ConfigInputNode(this.configDefNode.children[i],this));	
			}
		}
    },
    generateHtml: function(){
		// var firstLv = new Element('div');
		// div.insert( new Element('img', { src: json.src }) );
		// div.insert(" " + json.name);
		// $('container').insert(div); // inserts at bottom




    	var htmlText='';


    	// ---------- 'section' div open ----------
		htmlText+='<div class="row" id="section_'+this.id+'">'; 

		// ---------- 11/12 of 'section' div open ----------

		//make it 10+2 when this.type is single type and this.parent.type is list, otherwise: 11+1
		if ((this.configDefNode.parent.type=='list')&&(this.configDefNode.type!='list')&&(this.configDefNode.type!='dict')){
			htmlText+='<div class="col-sm-10">'; 
		}
		else{
			htmlText+='<div class="col-sm-11">'; 
		} 
		
		// ksdjflksjdlf = "<html>sdhnkjfhsadjfkh<TAG1>
		// layout - master
		// 	header
		// 	body
		// 		form
		// 		div
		// 			message
		// 				key value
		// 				VALIDATAION_NAME = "Name length = 6"

		// 		menu
		// 		footer	
		
		// </html>"

		// ksdjflksjdlf = replace(TAG1, "value2");

    	if ((this.configDefNode.type=='list')||(this.configDefNode.type=='dict')){
			htmlText+='<div class="form-group container-fluid">';
			htmlText+='	<div class="row">';

	    	if (this.configDefNode.parent.type !='list'){
	    		htmlText+= ' <label class="col-sm-2">'+this.configDefNode.display_name+':</label>';	
	    		htmlText+='	 <div class="col-sm-10 well">';
	    	}
	    	else{
	    		htmlText+= ' <label class="col-sm-1">-</label>';
	    		htmlText+='	 <div class="col-sm-11 well">';
	    		// htmlText+='	 <div class="col-sm-12 well">';
	    	}
			// htmlText+='	 <label class="col-sm-2" >'+this.display_name+':</label>';
			// htmlText+='	 <div class="col-sm-10 well">';

			htmlText+='   <button type="button" class="btn btn-secondary" data-toggle="collapse" href="#'+this.id+'">Click to Collapse/Expand</button>';
			htmlText+='	  <div class="collapse" id="'+this.id+'">';
			htmlText+='    <hr>';
			htmlText+='    <h4>Description: '+this.configDefNode.description+'</h4>';
			console.log(this.id+"  "+this.configDefNode.minimum_occurrence+" "+this.configDefNode.maximum_occurrence);
			if (this.configDefNode.minimum_occurrence==0){

			htmlText+='    <div class="checkbox emptyList"><label><input type="checkbox">Empty List</label></div>';
			}
			htmlText+='   </div>';
			htmlText+='  </div>';
			htmlText+=' </div>';
			htmlText+='</div>';
    	}
    	else{    		
	    	htmlText+= '<div class=" container-fluid" id="'+this.id+'">';
	    	htmlText+='	<div class="row form-inline">';
	    	if (this.configDefNode.parent.type !='list'){
	    		htmlText+= ' <label class="col-sm-2">'+this.configDefNode.display_name+':</label>';	
	    	}
	    	else{
	    		// htmlText+= ' <label class="col-sm-1">-</label>';
	    	}
	    	htmlText+= ' <input type="text" class="form-control width-specific inputNode" placeholder="'+this.configDefNode.description+'">';


	    	if (this.configDefNode.allow_null){
	    	htmlText+='    <div class="checkbox inputNull"><label><input type="checkbox">Null</label></div>';
	    	}
	    	// htmlText+= ' <input type="text" class="form-control" placeholder="'+this.configDefNode.description+'">';
	    	// htmlText+='    <label class="checkbox-inline">Option 1</label>';
	    	// htmlText+='    <input type="checkbox" value="">';


			// htmlText+= '<label class="custom-control custom-checkbox">Hello</label>';
			// htmlText+= '  <input type="checkbox" class="custom-control-input">';
			// htmlText+= '  <span class="custom-control-indicator"></span>';
			// htmlText+= '  <span class="custom-control-description">Check this custom checkbox</span>';
			// htmlText+= '</label>';

	    	// htmlText+= ' <div class="form-control-feedback">Shucks, check the formatting of that and try again.</div>';
	    	// htmlText+= ' <input type="text" class="form-control" placeholder="'+this.configDefNode.description+'" data-toggle="tooltip" data-placement="top" title="Tooltip on top">';
	    	// htmlText+= ' <i class="form-control-feedback glyphicon glyphicon-remove" data-fv-icon-for="message" style=""></i>';
	    	// htmlText+= ' <span class="for_validation glyphicon glyphicon-ok text-success"></span>';
	    	// htmlText+= ' <span class="for_validation glyphicon glyphicon-remove text-danger"></span>';

	    	// .removeAttribute("class");
	    	// setAttribute("target", "_self");

	    	// $('[data-toggle="tooltip"]').tooltip()
	    	// result = $('#'+this.id).find('input').val();
	    	htmlText+='	</div>';
	    	// htmlText+='    <div class="checkbox"><label><input type="checkbox" value="empty">Empty List</label></div>';
	    	// htmlText+='    <label class="checkbox-inline"><input type="checkbox" value="">Option 1</label>';

	  //   	htmlText+= '<div class="radio"><label><input type="radio" name="optradio">Option 1</label></div>';
			// htmlText+= '<div class="radio"><label><input type="radio" name="optradio">Option 2</label></div>';
			// htmlText+= '<div class="radio"><label><input type="radio" name="optradio" disabled>Option 3</label></div>';
	    	
	    	htmlText+='</div>';
	    }
		htmlText+='</div>'; 
		// ---------- 11/12 of 'section' div end ----------

		// ---------- 1/12 of 'section' div open ----------
		 
		if (this.configDefNode.parent.type=='list'){

			//make it 10+2 when this.type is single type and this.parent.type is list, otherwise: 11+1
			if ((this.configDefNode.type!='list')&&(this.configDefNode.type!='dict')){
				htmlText+='<div class="col-sm-2">'; 
			}
			else{
				htmlText+='<div class="col-sm-1">'; 
			}

			// if it's parent is list, check whether the button is 'add' or 'delete'
			if (this.parent.children.length>=1){
				htmlText+='<button type="button" onclick="deleteListItem('+this.id+')" class="btn btn-danger"> x </button>';	
			}
			else{
				htmlText+='<button type="button" onclick="addListItem('+this.id+')" class="btn btn-success"> + </button>';		
			}
		}
		else{
			htmlText+='<div class="col-sm-1">';
		}
		htmlText+='</div>';	
		// ---------- 1/12 of 'section' div end ----------

		htmlText+='</div>';
		// ---------- 'section' div end ----------

    	if (this.parent.id==globalRootId){
    		htmlText+='<hr>';
    	}

		this.htmlText = htmlText;
    },
	appendDOM: function(){
		$('#'+this.parent.id).append(this.htmlText);
		if (this.hasChildren){
			for (var i in this.children){
				this.children[i].appendDOM();
			}			
		}
		$('[data-toggle="tooltip"]').tooltip()
	},
	toJson: function(){
    	var result;
    	if (this.configDefNode.type == 'list'){
    		result=[];
    		if ($('#'+this.id).children('.emptyList').find('input').prop('checked')){
    			return result;
    		}
    		for (var i=0;i<this.children.length;i++){
    			result.push(this.children[i].toJson());
    		}
    	}
    	else if (this.configDefNode.type == 'dict'){
    		result={};
    		for (var i=0;i<this.children.length;i++){
    			result[this.children[i].configDefNode.internal_name] = this.children[i].toJson();
    		}    		
    	}
    	else{
    		result = $('#'+this.id).find('input').val();
    		if ($('#'+this.id+' .inputNull').find('input').prop('checked')){
    			result = null;
    		}
    	}
    	return result;
	},
	validateInput: function(){

		var validate_result = true;


    	if ((this.configDefNode.type == 'list')||(this.configDefNode.type == 'dict')){
    		if ($('#'+this.id).children('.emptyList').find('input').prop('checked')){
    			return true;
    		}
    		for (var i=0;i<this.children.length;i++){
    			validate_result=this.children[i].validateInput()&&validate_result;
    		}
    	}
    	else{
    		var inputNode = $('#'+this.id).find('.inputNode');
    		var pass = true;
    		var htmlText = '';
		    	// var htmlText = ' <span class="for_validation glyphicon glyphicon-remove text-danger"></span>';

    		// if (!$('#'+this.id+' .inputNull').find('input').prop('checked')&&((this.configDefNode.mandatory==true)||(this.configDefNode.parent.type=='list'))){
    		if ((this.configDefNode.mandatory==true)){
		    	// inputNode[0].setAttribute("data-toggle", "tooltip");
		    	// inputNode[0].setAttribute("data-placement", "top");
		    	// inputNode[0].setAttribute("title", "Cannot be empty");   
		    	// var re=/^\s*$/;
		    	if (!$('#'+this.id+' .inputNull').find('input').prop('checked')){
			    	var re=/^$/;
		    		if (re.test(inputNode.val())){
				    	htmlText += '<small class="for_validation form-text text-muted"> *Cannot be empty </small>';
		    			// inputNode.parent().append(htmlText);
						pass = false;
						validate_result = false;
		    		}
		    	}
	    		

    		}

    		if (this.configDefNode.type=='decimal'){
    			if (!$('#'+this.id+' .inputNull').find('input').prop('checked')){
	    			var re=/^-{0,1}\d+\.?\d*$/;
	    			if (!re.test(inputNode.val())){
	    				htmlText += '<small class="for_validation form-text text-muted"> *Must be decimal </small>';
	    				pass = false;
	    				validate_result = false;
	    			}
	    		}
    		}

    		if (pass==true){
    			var displayResult = ' <span class="for_validation glyphicon glyphicon-ok text-success"></span>';
	    		inputNode.parent().append(displayResult);
    		}
    		else{
	    		var displayResult = ' <span class="for_validation glyphicon glyphicon-remove text-danger"></span>';
	    		inputNode.parent().append(displayResult);
	    		inputNode.parent().append(htmlText);
    		}
    	}

    	return validate_result;

	}
}


function addListItem(currentId){
	var currentInputNode = configMap.get(currentId);
	var currentParent = currentInputNode.parent;

	if ((currentParent.configDefNode.maximum_occurrence!=-1)&&(currentParent.children.length>=currentParent.configDefNode.maximum_occurrence)){
		alert("cannot add input, maximum_occurrence = "+currentParent.configDefNode.maximum_occurrence);
	}
	else{
		var newInputNode = new ConfigInputNode(currentInputNode.configDefNode,currentParent);
		currentParent.add(newInputNode);
		newInputNode.appendDOM();
	}
	
}

function deleteListItem(currentId){
	var currentInputNode = configMap.get(currentId);
	var currentParent = currentInputNode.parent;

	if ((currentParent.configDefNode.maximum_occurrence!=-1)&&(currentParent.children.length<=currentParent.configDefNode.minimum_occurrence)){
		alert("cannot delete input, minimum_occurrence = "+currentParent.configDefNode.minimum_occurrence);
	}
	else{
		currentInputNode.detachFromMap();
		currentParent.remove(currentInputNode);

	    $('#section_'+currentId).remove();
	}


}

function convertToJson(){

	// htmlText+= ' <input type="text" class="form-control" placeholder="'+this.configDefNode.description+'" data-toggle="tooltip" data-placement="top" title="Tooltip on top">';
	// htmlText+= ' <i class="form-control-feedback glyphicon glyphicon-remove" data-fv-icon-for="message" style=""></i>';
	// htmlText+= ' <span class="for_validation glyphicon glyphicon-ok text-success"></span>';
	
	// htmlText+= ' <span class="glyphicon glyphicon-remove text-danger hidden"></span>';
	// $('[data-toggle="tooltip"]').tooltip()
	// result = $('#'+this.id).find('input').val();	

	$('.for_validation').remove();
	// $('[data-toggle="tooltip"]').tooltip('destroy');
	// rootTree.
	var validate_result = rootTree.validateInput();
	console.log(validate_result);
	$('.collapse').collapse('show');

	// $('[data-toggle="tooltip"]').tooltip('enable');
	// $('[data-toggle="tooltip"]').tooltip('disable');

	var stringOutput;

	if (validate_result){
		var jsonOutput = rootTree.toJson();

		stringOutput = '<h5><pre>'+JSON.stringify(jsonOutput,null, 2)+'</pre></h5>';

		// console.log(output);
		// console.log(JSON.stringify(output));

		var parts = stringOutput.split('\\\\');
		var stringOutput = parts.join('\\');
		console.log(stringOutput);

	}
	else{
		stringOutput = '<h5><pre>You input has error!</pre></h5>';
	}


	$('#'+configResultId).empty();
	$('#'+configResultId).append('<h3>Result:</h3>');
	$('#'+configResultId).append(stringOutput);


}


// componentName = 'testForPluginBuildingWizard';
// displayComponent(componentName)		displayComponent('SplitByPatternComponentImpl') 	displayComponent('LogTimeExtractionInputComponentImpl')  	displayComponent('PatternDistinguishComponentImpl') 
//  SplitByPatternComponentImpl LogTimeExtractionInputComponentImpl PatternDistinguishComponentImpl

var globalRootId = 'newJStoHTML';
var componentListId = 'dropDownList';
var configResultId = 'configResult';
var configMap = new Map();
var globalId = 0;

function displayComponent(componentName){

	$('#'+configResultId).empty();
	componentDef = new ComponentDef(componentName);
	console.log(componentDef);
	rootTree = new ComponentInput(componentDef,globalRootId);
	console.log(rootTree);

	rootTree.appendDOM();
}


function showPluginList(){
	$('#'+componentListId).empty();

	for (var key in componentDefList){
		var className = key; //new_component_list[i].class_name;
		var option = '<li><a href="#" onclick=displayComponent("'+className+'")>'+className+'</a></li>';
		$('#'+componentListId).append(option);
	}

}

function expandAll(action){
	$('.collapse').collapse(action);
}


// var dataTest = {
// 	title: 'ttile here',
// 	supplies:[
// 		'map',
// 		'broom',
// 		'duster'
// 	]

// }
// "abc #k1".replace(/#k1/g,"result")
// var html_111 = new EJS({url: 'template.ejs'});
// .render(dataTest);
// console.log(html_111);
// $('#ejsTest').append(html_111);
