var input = document.getElementById("inp");

input.addEventListener("keypress", function (event) {
  if (event.key === "Enter") {
    event.preventDefault();
    alert(formatPhoneNumber(input.value));
  }
});

function formatPhoneNumber(phoneNumberString) {
  var cleaned = ("" + phoneNumberString).replace(/\D/g, "");
  var match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
  if (match) {
    return "+38 (" + match[1] + ") " + match[2] + "-" + match[3];
  }
  return "Incorrect phone number";
}

var symb = "a",
  button = document.getElementById("button");

function count(str, symb) {
  for (
    var count = -1, index = 0;
    index != -1;
    count++, index = str.indexOf(symb, index + 1)
  );

  return count;
}

function getResult() {
  const string1 = document.getElementById("inp1").value;
  const string2 = document.getElementById("inp2").value;
  if (string1 && string2)
    alert(count(string1, symb) > count(string1, symb) ? string1 : string2);
  else alert("String query is null");
}

button.onclick = function () {
  getResult();
};
