AUI().use('aui-form-validator-custom',
            function (A) {
                A.mix(
                        A.config.FormValidator.RULES,
                        {                            
                            requiredIfEmpty: function (val, fieldNode, targetInputs) {
                                var result = true;
                                targetInputs.forEach(function(input) {
                                    var targetInputVal = A.one('#' + opts.ns + input).get('value');
                                    if (!val && !targetInputVal) {
                                        result = false;
                                    }
                                });
                                return result;
                            },
                            forbiddenIfNotEmpty: function (val, fieldNode, targetInputs) {
                                var result = true;
                                targetInputs.forEach(function(input) {
                                    var targetInputVal = A.one('#' + opts.ns + input).get('value');
                                    if (val && targetInputVal) {
                                        result = false;
                                    }
                                });
                                return result;
                            },
                            exactLength: function (val, fieldNode, ruleValue) {
                                return !val || !!(val.length == ruleValue);
                            },
                            pastDateOrToday: function(val, fieldNode, ruleValue) {
                                /*parsing format dd.MM.yyyy*/
                                var dateparts = val.split(".");
                                var value = new Date(dateparts[2], dateparts[1]-1, dateparts[0]);
                                var tommorow = A.Date.addDays(A.Date.parse(new Date()),1);   
                                tommorow.setHours(0,0,0,0);
                                return value!==null && (value < tommorow);
                            }
                        },
                        true
                        );                                                  
                var boundingBox = "#" + opts.ns + "form";
                validator = new A.FormValidator({
                    boundingBox: boundingBox,
                    validateOnInput: true,
                    rules: {
                        input1:{
                            requiredIfEmpty: ['input2'],
                            forbiddenIfNotEmpty: ['input2'],
                            exactLength: 6,
                            custom:true // validate even if field is empty - bugfix AlloyUI 2.0 fixed in aui-form-validator-custom (AlloyUI 3.0)                          
                        },
                        input2:{
                            requiredIfEmpty: ['input1'],
                            forbiddenIfNotEmpty: ['input1'],
                            exactLength: 7,
                            custom:true // validate even if field is empty - bugfix AlloyUI 2.0 fixed in aui-form-validator-custom (AlloyUI 3.0)
                        }
                    },
                    on: {
                        submit: function () {
                        }
                    }
                });                   
            }