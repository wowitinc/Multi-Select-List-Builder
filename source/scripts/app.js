/*IIFE - Immediately Invoked Function Expression*/
(function(mslbcode) {
    /*jQuery object is global passed as parm*/
    mslbcode(window.jQuery, window, document);
    }(function($, window, document) {
        /*scoping function / ready event*/
        $(function () {

/*------------------------------------------------------*/
            /*DELETE element from a list*/
            function fDeleteItem(sElemSelected) {
                var sForReturn = "";
                var sValSelected = $(sElemSelected).text();
                if (sValSelected.length == 0) { /*nothing selected*/
                    fDisplayMessages($("#displayInfoWarn"), "WARNING: Please select an item from the list and retry.", "WARNING-01 FUNCTION fDeleteItem");
                    sForReturn = "none";
                } else {
                    $(sElemSelected).remove();
                    sForReturn = "found";
                }
                return (sForReturn);
            }

/*------------------------------------------------------*/
            /*ADD element to a list*/
            function fAddItem(sValSelected, hToList, sType) {
                var sForReturn = "";
                if (sValSelected.length == 0) { /*nothing entered*/
                    if (sType == "field") {
                        fDisplayMessages($("#displayInfoWarn"), "WARNING: Please enter an item in the Add field and retry.", "WARNING-01 FUNCTION fAddItem");
                    } else {
                        if (sType == "list") {
                            fDisplayMessages($("#displayInfoWarn"),"WARNING: Please select an item from the list and retry.", "WARNING-02 FUNCTION fAddItem");
                        } else {
                            fDisplayMessages($("#displayErrors"),"ERROR: Error in uploaded custom file.", "ERROR-01 FUNCTION fAddItem");
                        }
                    }
                    sForReturn = "none";
                } else {
                    $(hToList).append("<option>"+sValSelected+"</option>");
                    sForReturn = "found";
                }
                return (sForReturn);
            }

/*------------------------------------------------------*/
            /*PLUS element to a list*/
            function fPlusItem(sElemSelectedStatus, sElemSelectedCalcs, sOptionItem) {
                var sForReturn = "";
                var sValSelectedStatus = $(sElemSelectedStatus).text();
                var sValSelectedCalcs = $(sElemSelectedCalcs).text();
                if (sValSelectedStatus.length == 0) {
                    if (sValSelectedCalcs.length == 0) { /*no Status nor Calculations selected*/
                        fDisplayMessages($("#displayInfoWarn"), "WARNING: Please ensure both an item to be added (from the Status List) AND the destination item (in the Calculations list) have been selected.  Then retry.", "WARNING-01 FUNCTION fPlusItem");
                        sForReturn = "none";
                    } else { /*no Status selected*/
                        fDisplayMessages($("#displayInfoWarn"), "WARNING: Please ensure the item to be added (from the Status List) has been selected and then retry.", "WARNING-02 FUNCTION fPlusItem");
                        sForReturn = "none";
                    }
                } else {
                    if (sValSelectedCalcs.length == 0) { /*no Calculations selected*/
                        fDisplayMessages($("#displayInfoWarn"), "WARNING: Please ensure the destination item (in the Calculations list) has been selected and then retry.", "WARNING-03 FUNCTION fPlusItem");
                        sForReturn = "none";
                    } else {
                        var iIndex = $(sElemSelectedCalcs).index();
                        $(sOptionItem[iIndex]).text(sValSelectedCalcs+" + "+sValSelectedStatus);
                        sForReturn = "found";
                    }
                }
                return (sForReturn);
            }

/*------------------------------------------------------*/
            /*MOVE element within a list*/
            function fMoveItem(sElemSelected, sOptionItem, sDirection) {
                var sForReturn = "";
                var sValSelected = $(sElemSelected).text();
                if (sValSelected.length == 0) { /*nothing selected*/
                    fDisplayMessages($("#displayInfoWarn"), "WARNING: Please select an item in the list and retry.", "WARNING-01 FUNCTION fMoveItem");
                    sForReturn = "none";
                } else {
                    var iIndex = $(sElemSelected).index();
                    var sOption = $(sOptionItem);
                    switch (sDirection) {
                        case "UP":
                            if (iIndex == 0) {
                                fDisplayMessages($("#displayInfoWarn"), "NOTE: The item is already at the top of the list.", "INFO-01 FUNCTION fMoveItem");
                                sForReturn = "none";
                            } else {
                                $(sOption[iIndex]).insertBefore($(sOption[iIndex-1]));
                                sForReturn = "found";
                            }
                            break;
                        case "DOWN":
                            if (iIndex == $(sOptionItem).length-1) {
                                fDisplayMessages($("#displayInfoWarn"), "NOTE: The item is already at the bottom of the list.", "INFO-02 FUNCTION fMoveItem");
                                sForReturn = "none";
                            } else {
                                $(sOption[iIndex]).insertAfter($(sOption[iIndex+1]));
                                sForReturn = "found";
                            }
                            break;
                        default:
                            fDisplayMessages($("#displayErrors"), "ERROR: Invalid move direction.  Please retry.", "ERROR-01 FUNCTION fMoveItem");
                    }
                }
                return (sForReturn);
            }

/*------------------------------------------------------*/
            /*parse values for "+" separator*/
            function fParseItem(sValue, hToList) {
                var sParsedValue = "";
                var sForReturn = "";
                var iPlusIndex = sValue.indexOf("+");
                while (iPlusIndex >= 0) {
                    sParsedValue = sValue.substring(0,iPlusIndex-1);
                    sValue = sValue.substring(iPlusIndex+2);
                    iPlusIndex = sValue.indexOf("+");
                    sForReturn = fAddItem(sParsedValue, $(hToList), "list");
                }
                sForReturn = fAddItem(sValue, $(hToList), "list");
                return (sForReturn);
            }

/*------------------------------------------------------*/
            /*deep copy one list to another*/
            function fDeepCopyList(sOptionItem, hFromList, hToList, sType) {
                var sForReturn = "";
                if (sType == "Left") {
                    $(sOptionItem).each(function() {
                        sForReturn = fParseItem($(this).text(), $(hToList));
                    });
                } else {
                    $(sOptionItem).each(function() {
                        $(hToList).append("<option>"+$(this).text()+"</option>");
                        sForReturn = "found";
                    });
                }
                /*remove all elements from original list*/
                $(hFromList).find("option").remove();
                return (sForReturn);
            }

/*------------------------------------------------------*/
            /*collect elements from select lists*/
            function fRefreshList(sListName, sForm) {
                var aList = sListName + ": ";
                var count = 0;
                sForm.each(function() {
                    aList += ($(this).val()) + ", ";
                    count++;
                });
                if (aList.length-2 > sListName.length) {
                    aList = aList.slice(0,-2);
                }
                return {fRefreshListNameLength: count, fRefreshListReturnInfo: aList};
            }

/*------------------------------------------------------*/
            /*add current list data to customised file*/
            function fPrepCustom() {
                /*begin with header record*/
                var sDataPackage = "DO NOT MODIFY - CUSTOMISATION FILE FROM MSLB";
                /*add STATUS list record*/
                var sResults = fRefreshList("STATUS", $("#mslbListStatus option"));
                sDataPackage += "\r\n" + sResults.fRefreshListReturnInfo;
                /*add CALCS list record if list has data*/
                sResults = fRefreshList("CALCS", $("#mslbListCalcs option"));
                var iElemCalcs = sResults.fRefreshListNameLength;
                if (iElemCalcs != 0) {
                    sDataPackage += "\r\n" + sResults.fRefreshListReturnInfo;
                    /*add REPORT list record if number of elements matches CALCS*/
                    sResults = fRefreshList("REPORT", $("#mslbListReports option"));
                    var iElemReports = sResults.fRefreshListNameLength;
                    if (iElemCalcs == iElemReports) {
                        sDataPackage += "\r\n" + sResults.fRefreshListReturnInfo;
                    } else {
                        fDisplayMessages($("#displayInfoWarn"), "WARNING: The number of elements in the Calculations list must match the number of elements in the Report Categories list.  Please review the list entries and retry.", "WARNING-01 FUNCTION fPrepCustom");
                        sDataPackage = "none";
                    }
                } else {
                    fDisplayMessages($("#displayInfoWarn"), "WARNING: Please enter information into the Calculations list and retry.", "WARNING-02 FUNCTION fPrepCustom");
                    sDataPackage = "none";
                }
                return (sDataPackage);
            }

/*------------------------------------------------------*/
            /*parse CSV file*/
            function fParseLists(sFileData) {
                var sFuncReturn = "";
                var sPopReturn = "";
                var sAllLines = sFileData.split(/\r\n|\n/);
                /*parse file records*/
                if (sAllLines.length == 1) {
                    fDisplayMessages($("#displayInfoWarn"), "WARNING: The file selected is not in the correct format.  Please ensure only a file previously saved within this application is selected and contains true CSV formatting.", "WARNING-01 FUNCTION fParseLists");
                } else {
                    for (var i=1; i<sAllLines.length; i++) {
                        var sRecordData = sAllLines[i].split(",");
                        /*parse record elements*/
                        for (var j=0; j<sRecordData.length; j++) {
                            if (j == 0) {
                                var iFirstIndex = sRecordData[j].indexOf(":");
                                if (iFirstIndex == -1) {
                                    fDisplayMessages($("#displayInfoWarn"), "WARNING: The file selected is not in the correct format.  Please ensure only a file previously saved within this application is selected.", "WARNING-02 FUNCTION fParseLists");
                                    sFuncReturn = "none";
                                } else {
                                    var sList = sRecordData[j].substring(0,iFirstIndex+1);
                                    sFuncReturn = fPopLists(sList, sRecordData[j].trim(), "First");
                                    if (sFuncReturn != "found") {
                                        fDisplayMessages($("#displayErrors"), "ERROR: Unable to clear elements for list="+sList+".  Please ensure only a file previously saved within this application is selected.", "ERROR-01 FUNCTION fParseLists");
                                    } else {
                                        var sElement = sRecordData[j].substring(iFirstIndex+2);
                                        sFuncReturn = fPopLists(sList, sElement.trim(), "Others");
                                    }
                                }
                            } else {
                                sFuncReturn = fPopLists(sList, sRecordData[j].trim(), "Others");
                            }
                            if (sFuncReturn == "none") {
                                if (typeof sList !== "undefined") {
                                    fDisplayMessages($("#displayErrors"), "ERROR: Error populating "+sList+" list for element="+sRecordData[j]+".  Please ensure only a file previously saved within this application is selected.", "ERROR-02 FUNCTION fParseLists");
                                }
                                j = sRecordData.length; /*end inner for loop*/
                                i = sAllLines.length; /*end outer for loop*/
                            }
                        }
                    }
                }
            }

/*------------------------------------------------------*/
            /*populate HTML lists from uploaded user customisation file*/
            function fPopLists(sList, sStatus, sType) {
                var sListForPop = "";
                var sFuncReturn = "";
                switch (sList) {
                    case "STATUS:":
                        sListForPop = $("#mslbListStatus");
                        break;
                    case "CALCS:":
                        sListForPop = $("#mslbListCalcs");
                        break;
                    case "REPORT:":
                        sListForPop = $("#mslbListReports");
                        break;
                    default:
                        fDisplayMessages($("#displayErrors"), "ERROR: Invalid list entry in uploaded file.  Please ensure only a file previously saved within this application is selected.", "ERROR-01 FUNCTION fPopLists");
                }
                if (sType == "First") {
                    $(sListForPop).empty();
                    sFuncReturn = "found";
                } else {
                    var sFuncReturn = fAddItem(sStatus, $(sListForPop), "pop");
                }
                return (sFuncReturn);
            }

/*------------------------------------------------------*/
            /*display info / warning / errors messages*/
            function fDisplayMessages(hMsgID, sMessage, sConsole) {
                $("#msgtemp").remove();
                $(hMsgID).append("<p id=msgtemp>"+sMessage+"</p>");
                $(hMsgID).css("visibility", "visible");
                console.log(sConsole);
            }

/*------------------------------------------------------*/
            /*hide any info / warning / errors messages*/
            function fHideMessages() {
                $("#msgtemp").remove();
                $("#displayErrors").css("visibility", "hidden");
                $("#displayInfoWarn").css("visibility", "hidden");
            }

/*------------------------------------------------------*/
            /*button to ADD element to STATUS list*/
            $("#mslbAddBtnStatus").on("click", function(e) {
                e.preventDefault();
                fHideMessages(); /*hide any current messages*/
                var sFuncReturn = fAddItem($("#statusAdd").val(), $("#mslbListStatus"), "field");
                $("#statusAdd").val(""); /*refresh field placeholder*/
            });

/*------------------------------------------------------*/
            /*button to DELETE element from STATUS list*/
            $("#mslbDelBtnStatus").on("click", function(e) {
                e.preventDefault();
                fHideMessages(); /*hide any current messages*/
                var sFuncReturn = fDeleteItem($("#mslbListStatus option:selected"));
            });

/*------------------------------------------------------*/
            /*button to RIGHT move ALL elements from one list to another*/
            $("#mslbRightAllBtn").on("click", function(e) {
                fHideMessages(); /*hide any current messages*/
                var sFuncReturn = fDeepCopyList($("#mslbListStatus option"), $("#mslbListStatus"), $("#mslbListCalcs"), "Right");
            });

/*------------------------------------------------------*/
            /*button to LEFT move ALL elements from one list to another*/
            $("#mslbLeftAllBtn").on("click", function(e) {
                fHideMessages(); /*hide any current messages*/
                var sFuncReturn = fDeepCopyList($("#mslbListCalcs option"), $("#mslbListCalcs"), $("#mslbListStatus"), "Left");
            });

/*------------------------------------------------------*/
            /*button to LEFT move selected element*/
            $("#mslbLeftSingleBtn").on("click", function(e) {
                fHideMessages(); /*hide any current messages*/
                var sFuncReturn = fParseItem($("#mslbListCalcs option:selected").text(), $("#mslbListStatus"));
                if (sFuncReturn == "found") {
                    var sNextReturn = fDeleteItem($("#mslbListCalcs option:selected"));
                }
            });

/*------------------------------------------------------*/
            /*button to RIGHT move selected element*/
            $("#mslbRightSingleBtn").on("click", function(e) {
                fHideMessages(); /*hide any current messages*/
                var sFuncReturn = fAddItem($("#mslbListStatus option:selected").text(), $("#mslbListCalcs"), "list");
                if (sFuncReturn == "found") {
                    var sNextReturn = fDeleteItem($("#mslbListStatus option:selected"));
                }
            });

/*------------------------------------------------------*/
            /*button to sum multiple items in one list*/
            $("#mslbPlusBtn").on("click", function(e) {
                fHideMessages(); /*hide any current messages*/
                var sFuncReturn = fPlusItem($("#mslbListStatus option:selected"), $("#mslbListCalcs option:selected"), $("#mslbListCalcs option"));
                if (sFuncReturn == "found") {
                    var sNextReturn = fDeleteItem($("#mslbListStatus option:selected"));
                }
            });

/*------------------------------------------------------*/
            /*button to move UP element in list*/
            $("#mslbUpBtn").on("click", function(e) {
                fHideMessages(); /*hide any current messages*/
                var sFuncReturn = fMoveItem($("#mslbListCalcs option:selected"), $("#mslbListCalcs option"), "UP");
            });

/*------------------------------------------------------*/
            /*button to move DOWN element in list*/
            $("#mslbDownBtn").on("click", function(e) {
                fHideMessages(); /*hide any current messages*/
                var sFuncReturn = fMoveItem($("#mslbListCalcs option:selected"), $("#mslbListCalcs option"), "DOWN");
            });

/*------------------------------------------------------*/
            /*button to add element to REPORT list*/
            $("#mslbAddBtnReports").on("click", function(e) {
                e.preventDefault();
                fHideMessages(); /*hide any current messages*/
                var sFuncReturn = fAddItem($("#repAdd").val(), $("#mslbListReports"), "field");
                $("#repAdd").val(""); /*resets placeholder*/
            });

/*------------------------------------------------------*/
            /*button to delete element from REPORT list*/
            $("#mslbDelBtnReports").on("click", function(e) {
                e.preventDefault();
                fHideMessages(); /*hide any current messages*/
                var sFuncReturn = fDeleteItem($("#mslbListReports option:selected"));
            });

/*------------------------------------------------------*/
            /*button to SAVE the MSLB selections*/
            $("#mslbSaveCustomBtn").on("click", function(e) {
                e.preventDefault();
                var sTempData = fPrepCustom();
                if (sTempData != "none") {
                    var sTempType = "data:text/plain;charset=utf-8,";
                    var sTempName = "mslbCustom.csv";
                    $("body").append($("<a>")
                        .attr ({
                            id: "temp",
                            href: sTempType + encodeURIComponent(sTempData),
                            download: sTempName,
                            style: "display: none;"
                        }
                    ));
                    $("#temp")[0].click();
                    $("#temp").remove();
                }
            });

/*------------------------------------------------------*/
            /*button to UPLOAD an existing customisation file*/
            $("#mslbUploadCustomBtn").on("click", function(e) {
                /*exit modal window after SAVE is clicked*/
                $("#mslbUploadCancel").click();

                /*ensure file extension is CSV or TXT*/
                var sRegex = /^([a-zA-Z0-9\s_\\.\-:])+(.csv|.txt)$/;
                if (sRegex.test($("#mslbUserFile").val().toLowerCase())) {

                    /*confirm FileReader can be used without error*/
                    if (typeof FileReader != "undefined") {
                        var sReadTheInput = new FileReader();

                        /*onload is the listener for readAsText*/
                        sReadTheInput.onload = function (e) {
                            var sRawInput = e.target.result;
                            fParseLists(sRawInput);
                        }
                        sReadTheInput.readAsText($("#mslbUserFile")[0].files[0]);
                    } else {
                        fDisplayMessages($("#displayErrors"), "ERROR: This browser does not support HTML5.", "ERROR-01 OnClick UPLOAD");
                    }
                } else {
                    fDisplayMessages($("#displayErrors"), "ERROR: Please upload a valid CSV file.", "ERROR-02 OnClick UPLOAD");
                }
            });

        });

    }
));