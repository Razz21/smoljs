import { defineComponent } from "simple-vue";

const Component = defineComponent({
  render({ name, children }: { name?: string; children: JSX.Element }) {
    return (
      <span data-test="hello" className="my-class" onClick={() => console.log("clicked")}>
        <p>name: {name}</p>
        <p>children: {children}</p>
      </span>
    );
  },
});

export default Component;

export function ComponentFC({ children }: { children: any }) {
  return <span>{children}</span>;
}
