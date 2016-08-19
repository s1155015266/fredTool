var jsonData = (function() {
	var _componentDefList={
		"testForPluginBuildingWizard":
		{
			"class_name":"testForPluginBuildingWizard",
			"display_name":"testing class",
			"description": "Test for Plugin Building Wizard",
			"config":[
				{
					"internal_name":"dimension_list",
					"display_name":"Dimension List",
					"type":"list",
					"minimum_occurrence":2,
					"maximum_occurrence":5,
					"description":"description of dimension list",
					"children":[
						{
							"internal_name":null,
							"display_name":"Dimension",
							"description":"description of Dimension",
							"type":"dict",
							"children":[ // fred element
								{
									"internal_name":"d_name",
									"display_name":"Name of Dimension",
									"description":"input string",
									"type":"string",
									"mandatory":true,  //fred use true/false
								},
								{	
									"internal_name" : "char_set",
									"display_name" : "character set",
									"description":"input char set",
									"type"	: "string",
									"mandatory":true,
									"allow_null" : true,
								},
								{
									"internal_name":"tolerance",
									"display_name":"tolerance",
									"description":"input decimal",
									"type":"decimal",
									"mandatory":true,
									"max" : 1,
									"min" : 0,
								},
							]
						}
					]
				},
				{
					"internal_name":"grouping_pattern",
					"display_name":"grouping pattern",
					"description":"input regex",
					"type":"regex",
					"mandatory" : "Y",
				},
				{
					"internal_name" : "grouping_name_list",
					"display_name" : "grouping name list",
					"description":"description of grouping name list",
					"type"	: "list", //fred only list have quantity
					// "quantity":"0..m", //fred quantity max/quantity min
					"minimum_occurrence":0,
					"maximum_occurrence":5,
					"children":[
						{
							// "internal_name":null, // fred remove optional property
							// "display_name":null,
							"description":"input string",
							"type":"string",
							// "mandatory" : "Y",
							"allow_null" : true,
						},
					]
				},
				{
					"internal_name":"list_of_dict_of_list",
					"display_name":"List of dict of list",
					"description":"This is about list of dict of list",
					"type":"list",
					"minimum_occurrence":1,
					"maximum_occurrence":5,
					"children":[
						{
							// "internal_name":null,
							// "display_name":"Dict",
							"description":"This is about dict containing list",
							"type":"dict",
							"children":[ // fred element
								{
									"internal_name":"d_name",
									"display_name":"Name of Dimension",
									"description":"input string",
									"type":"string",
									"mandatory":true,  //fred use true/false
								},
								{	
									"internal_name" : "char_set",
									"display_name" : "character set",
									"description":"input char set",
									"type"	: "string",
									"mandatory":true,
								},
								{
									"internal_name":"tolerance",
									"display_name":"tolerance",
									"description":"input decimal",
									"type":"decimal",
									"mandatory":true,
									"max" : 1,
									"min" : 0,
								},
								{
									"internal_name":"list",
									"display_name":"List",
									"description":"This is about a list",
									"type":"list",
									"minimum_occurrence":0,
									"maximum_occurrence":5,
									"children":[
										{
											"description":"input string",
											"type":"string",
											"mandatory" : "Y",
										}
									]

								}
							]
						}
					]
				},
				{
					"internal_name":"Dict",
					"display_name":"Dict",
					"description":"this is a dict containing list",
					"type":"dict",
					"children":[ // fred element
						{
							"internal_name":"d_name",
							"display_name":"Name of Dimension",
							"description":"input string",
							"type":"string",
							"mandatory":true,  //fred use true/false
						},
						{	
							"internal_name" : "char_set",
							"display_name" : "character set",
							"description":"input char set",
							"type"	: "string",
							"mandatory":true,
						},
						{
							"internal_name":"tolerance",
							"display_name":"tolerance",
							"description":"input decimal",
							"type":"decimal",
							"mandatory":true,
							"max" : 1,
							"min" : 0,
						},
						{
							"internal_name":"list",
							"display_name":"List",
							"description":"this is a list",
							"type":"list",
							"children":[
								{
									"internal_name":"string_of_list",
									"display_name":"string of list",
									"description":"input string",
									"type":"string",
									"mandatory" : true,
									"allow_null" : true,
								}
							]

						}
					]
				},
				{
					"internal_name":"list_of_list",
					"display_name":"List of list",
					"description":"this is list of list",
					"type":"list",
					"children":[
						{
							"internal_name":"List2",
							"display_name":"List2",
							"description":"this is list 2",
							"type":"list",
							"children":[ 
								{
									"internal_name":"List3",
									"display_name":"List3",
									"description":"this is list 3",
									"type":"list",
									"minimum_occurrence":0,
									"maximum_occurrence":5,
									"children":[
										{
											"internal_name":"string_of_list3",
											"display_name":"string of list3",
											"description":"input string",
											"type":"string",
											"mandatory" : true,
										}
									]

								}
							]
						}
					]
				},
			]
		},
		"SplitByPatternComponentImpl":
		{
			"class_name":"SplitByPatternComponentImpl",
			"display_name":"split pattern",
			"description": "component B",
			"config":[
				{
					"internal_name":"grouping_pattern",
					"display_name":"grouping pattern",
					"description":"input regex",
					"type":"regex",
					"mandatory" : true,
					"allow_null" : true,
					"possible_values": ["\'^\[.*?\]\[.*?\]\[(.*?)\]\[(.*?)\]\[.*?\]\[.*?\]","12345"],
				},
				{
					"internal_name" : "grouping_name_list",
					"display_name" : "grouping name list",
					"description":"Please input a list of grouping name here",
					"type"	: "list",
					"minimum_occurrence":0,
					"maximum_occurrence":5,
					"children":[
						{
							"type":"string",
							"description":"input string",
							// "mandatory" : true,
							"allow_null" : true,
						},
					]
				}
			]
		},
		"LogTimeExtractionInputComponentImpl":
		{
			"class_name":"LogTimeExtractionInputComponentImpl",
			"display_name":"log time",
			"description": "component C",
			"config":[
				{
					"internal_name":"datetime_pattern",
					"display_name":"datetime pattern",
					"description":"input regex",
					"type":"regex",
					"mandatory" : true,
					"possible_values": ["^\[(\d{4})-(\d{2})-(\d{2}) (\d{2})\:(\d{2})\:(\d{2})\]","12345"],
				},
				{
					"internal_name" : "datetime_format",
					"display_name" : "datetime format",
					"description":"input datetime format",
					"type"	: "date_format",
					"allow_null" : true,
					"possible_values": ["%Y %m %d %H %M %S","YYYY-MM-DD"],
				}
			]
		},
		"PatternDistinguishComponentImpl":
		{
			"class_name":"PatternDistinguishComponentImpl",
			"display_name":"Pattern Distinguish",
			"description": "component C",
			"config":[
				{
					"internal_name" : "dimension_list",
					"display_name" : "dimension list",
					"description":"Please input a list of dimension here",
					"type"	: "list",
					"children":[
						{
							"display_name":"Dimension",
							"description":"description of Dimension",
							"type":"dict",
							"children":[ // fred element
								{
									"internal_name":"d_name",
									"display_name":"Name of Dimension",
									"description":"input string",
									"type":"string",
									"mandatory":true,  //fred use true/false
								},
								{	
									"internal_name" : "char_set",
									"display_name" : "character set",
									"description":"input char set",
									"type"	: "string",
									"mandatory":true,
								},
								{
									"internal_name":"tolerance",
									"display_name":"tolerance",
									"description":"input decimal",
									"type":"decimal",
									"mandatory":true,
									"max" : 1,
									"min" : 0,
								},
							]
						},
					]
				}
			]
		}
	}

	var that = {
		getComponentDefList : function()
		{
			return _componentDefList
		}
	}


	return that;
})();