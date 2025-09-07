import { createSignal, onCleanup, onMount, Show } from "solid-js";
import mergeClasses from "@robit-dev/tailwindcss-class-combiner"

function LimitedContentEditable(props) {
  const maxLength = props.maxLength ?? 100;
  const initialText = (props.children ?? "").toString().slice(0, maxLength);
  const [text, setText] = createSignal(initialText);
  const [isFocused, setIsFocused] = createSignal(false);
  let el;

  const updateText = () => {
    let content = el.innerText.replace(/\r/g, "");
    if (content.length > maxLength) {
      content = content.slice(0, maxLength);
      el.innerText = content;
      placeCaretAtEnd(el);
    }
    setText(content);
    props.onChange?.(content);
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const plain = (e.clipboardData || window.clipboardData).getData("text");
    const current = el.innerText;
    const remaining = maxLength - current.length;
    const toInsert = plain.slice(0, remaining);

    const selection = window.getSelection();
    if (!selection.rangeCount) return;

    const range = selection.getRangeAt(0);
    range.deleteContents();
    range.insertNode(document.createTextNode(toInsert));
    selection.collapseToEnd();

    updateText();
  };

  const placeCaretAtEnd = (el) => {
    const range = document.createRange();
    const sel = window.getSelection();
    range.selectNodeContents(el);
    range.collapse(false);
    sel.removeAllRanges();
    sel.addRange(range);
  };

  onMount(() => {
    el.innerText = initialText;
    el.addEventListener("paste", handlePaste);
    props.onChange?.(initialText);
  });

  onCleanup(() => {
    el.removeEventListener("paste", handlePaste);
  });

  return (
    <div className={mergeClasses(" relative w-fit",props?.class || props?.className)}>
      {/* Placeholder */}
      <Show 
        when={!isFocused() && text().trim() === ""}
        
      >
        <div 
          class="cursor-text absolute left-0 top-0 text-gray-400 select-none"
          onClick={() => {
            el?.focus();
            placeCaretAtEnd(el);
          }}
        >
          {props.placeholder}
        </div>
      </Show>
      <div
        ref={el}
        contentEditable={props?.disabled ?"false":"plaintext-only"}
        onInput={updateText}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        class=" whitespace-pre-wrap break-words"
        style={{ outline: "none" }}
      ></div>
      <Show when={isFocused()}>
        <p class="text-xs text-gray-500 absolute -bottom-4 left-0 w-fit ">
          {text().length} / {maxLength} characters
        </p>

      </Show>
    </div>
  );
}

export default LimitedContentEditable;




