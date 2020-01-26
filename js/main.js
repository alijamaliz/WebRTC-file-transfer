var files = []

function connect() {
  var otherDeviceCode = $("#otherDeviceCode").val();

  if (otherDeviceCode.length > 0) {
    startPeerConnection(otherDeviceCode);
  }
}

function disconnect() {
  closePeerConnection();
}

var lastSentFileIndex = 0;
function startSending() {
  if (files.length > 0 && lastSentFileIndex < files.length) {
    //for(i = 0; i < files.length; i++) {
      dataChannelSend({
        type: "start",
        data: {
          name: files[lastSentFileIndex].name,
          size: files[lastSentFileIndex].size,
          type: files[lastSentFileIndex].type,
          lastModified: files[lastSentFileIndex].lastModified,
          lastModifiedDate: files[lastSentFileIndex].lastModifiedDate
        }
      });
      sendFile(files[lastSentFileIndex],lastSentFileIndex);
      $(".btn-remove-file-" + lastSentFileIndex).removeClass("btn-danger").addClass("btn-warning")
                .attr("onclick", "")
                .attr("disabled", "disabled")
                .text("درحال دریافت...");
      lastSentFileIndex++;
    //}
  }
}


// call initialization file
if (window.File && window.FileList && window.FileReader) {
  var selectedFiles = $("#selectedFiles");
  var dragarea = $("#drag-area");

  // selection button
  selectedFiles.bind("change", handleFileSelection);

  // drag area
  dragarea.bind("dragover", dragingActive);
  dragarea.bind("dragleave", dragingActive);
  dragarea.bind("drop", handleFileSelection);
  // dragarea.css('display','block');
}

// file drag active
function dragingActive(e) {
  e.stopPropagation();
  e.preventDefault();
  e.target.className = (e.type == "dragover" ? "active" : "");
}

// file selection
function handleFileSelection(e) {
  // cancel event and active styling
  dragingActive(e);

  // fetch FileList object
  var files = e.originalEvent.target.files || e.originalEvent.dataTransfer.files;

  // process all File objects
  for (var i = 0, f; f = files[i]; i++) {
    addFile(f);
  }
}

function addFile(file) {
  $(".btn-start-send").removeClass("hidden");
  $("input[type=file]").addClass("hidden");

  files.push(file)

  $("#files-list").append(
    "<div class=\"col-sm-6 inline\" id=\"file-" + (files.length-1) + "\">" +
    "<div class=\"panel panel-default\">" +
      "<div class=\"panel-heading\">" +
        "<h3 class=\"panel-title dont-break-out\">" + file.name + "</h3>" +
      "</div>" +
       "<div class=\"panel-body\">" +
          "<p> نوع: <strong>" + file.type +
          "</strong><br>حجم: <strong>" + localizeNumbers(sizeOf(file.size)) +
          "</strong></p>" +
          "<div class=\"progress-bar\">" +
            "<div class=\"progress\"" +
            " style=\"width: 0%\"><span></span></div>"+
          "</div>" +
          "<button onclick=\"removeFile(" + (files.length -1) + ");\" class=\"btn-remove-file-" + (files.length-1) + "\"><span class=\"glyphicon glyphicon-remove\"" +
          "aria-hidden=\"true\"></span>حذف</button>" +
        "</div>" +
    "</div>" +
    "</div>"
  );
  
}

/*
  Human readable file size, copied from:
  https://stackoverflow.com/questions/10420352/converting-file-size-in-bytes-to-human-readable
*/
sizeOf = function (bytes) {
  if (bytes == 0) { return "0.00 B"; }
  var e = Math.floor(Math.log(bytes) / Math.log(1000));
  return (bytes/Math.pow(1000, e)).toFixed(2)+' '+' KMGTP'.charAt(e)+'B';
}

removeFile = function (index) {
  files.splice(index,1);
  $("#file-" + index).remove();
}

function localizeNumbers(number) {
  number = String(number)
  dic = { '0': '۰', '1': '۱', '2': '۲','3': '۳','4': '۴','5': '۵','6': '۶','7': '۷','8': '۸','9': '۹'};
  res = "";
  for (digit of number)
    if (dic[digit]) res += dic[digit];
    else res += digit;
  return res;
}