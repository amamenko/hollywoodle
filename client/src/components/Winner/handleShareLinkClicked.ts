import { Dispatch, SetStateAction } from "react";

export const handleShareLinkClicked = (
  shareLinkClicked: boolean,
  changeShareLinkClicked: Dispatch<SetStateAction<boolean>>,
  changeLastClicked: Dispatch<SetStateAction<string>>,
  shareLink?: string,
  path?: boolean
) => {
  // Handle copy to clipboard
  const el = document.createElement("textarea");
  el.value = shareLink || "";
  el.setAttribute("readonly", "");
  el.setAttribute("style", "position: absolute; left: -9999px;");
  document.body.appendChild(el);

  if (navigator.userAgent.match(/ipad|ipod|iphone/i)) {
    // save current contentEditable/readOnly status
    let editable = el.contentEditable;
    let readOnly = el.readOnly;

    // convert to editable with readonly to stop iOS keyboard opening
    el.contentEditable = "true";
    el.readOnly = true;

    // create a selectable range
    let range = document.createRange();
    range.selectNodeContents(el);

    // select the range
    let selection = window.getSelection();

    if (selection) {
      selection.removeAllRanges();
      selection.addRange(range);
      el.setSelectionRange(0, 999999);

      // restore contentEditable/readOnly to original state
      el.contentEditable = editable;
      el.readOnly = readOnly;
    }
  } else {
    el.select();
  }

  document.execCommand("copy");
  document.body.removeChild(el);

  if (!shareLinkClicked) {
    changeShareLinkClicked(true);
    changeLastClicked(path ? "path" : "link");
  }
};
