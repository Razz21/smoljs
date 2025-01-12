function DeleteButton(props: { onClick: () => void }) {
  return (
    <button className="delete-btn" onClick={props.onClick}>
      &#x2715;
    </button>
  );
}

export function TodoElement(props: {
  children: JSX.Element;
  onClick: () => void;
  onChange: (value: string) => void;
}) {
  return (
    <li className="todo">
      <div
        contentEditable="true"
        onChange={(event) => props.onChange((event.target as HTMLDivElement).innerText)}
      >
        {props.children}
      </div>
      <DeleteButton onClick={props.onClick} />
    </li>
  );
}
