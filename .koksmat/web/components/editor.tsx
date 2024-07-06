export const x = 1;
// "use client";
// import React, {
//   forwardRef,
//   useEffect,
//   useLayoutEffect,
//   useRef,
//   MutableRefObject,
// } from "react";
// import dynamic from 'next/dynamic';
// import Quill from "quill";

// const QuillEditor = dynamic(() => import('react-quill'), { ssr: false });

// import "quill/dist/quill.snow.css";
// // Define the props type
// interface EditorProps {
//   readOnly?: boolean;
//   defaultValue?: any; // Adjust this type according to the actual type of defaultValue
//   onTextChange?: (...args: any[]) => void; // Adjust the function signature as needed
//   onSelectionChange?: (...args: any[]) => void; // Adjust the function signature as needed
//   setEditor?: (quill: Quill | null) => void; //
// }

// // ForwardRefRenderFunction should have the ref type as Quill or null
// const Editor = forwardRef<Quill | null, EditorProps>(
//   (
//     {
//       readOnly = false,
//       defaultValue,
//       onTextChange,
//       onSelectionChange,
//       setEditor,
//     },
//     ref
//   ) => {
//     const containerRef = useRef<HTMLDivElement>(null);
//     const defaultValueRef = useRef(defaultValue);
//     const onTextChangeRef = useRef(onTextChange);
//     const onSelectionChangeRef = useRef(onSelectionChange);

//     useLayoutEffect(() => {
//       onTextChangeRef.current = onTextChange;
//       onSelectionChangeRef.current = onSelectionChange;
//     }, [onTextChange, onSelectionChange]);

//     useEffect(() => {
//       if (ref && "current" in ref && ref.current) {
//         (ref as MutableRefObject<Quill>).current.enable(!readOnly);
//       }
//     }, [ref, readOnly]);

//     useEffect(() => {
//       const container = containerRef.current;
//       if (!container) return;

//       const editorContainer = container.appendChild(
//         container.ownerDocument.createElement("div")
//       );
//       const quill = new Quill(editorContainer, {
//         theme: "snow",
//       });

//       if (ref && "current" in ref) {
//         (ref as MutableRefObject<Quill | null>).current = quill;
//       }

//       if (defaultValueRef.current) {
//         quill.setContents(defaultValueRef.current);
//       }

//       quill.on(Quill.events.TEXT_CHANGE, (...args) => {
//         onTextChangeRef.current?.(...args);
//       });

//       quill.on(Quill.events.SELECTION_CHANGE, (...args) => {
//         onSelectionChangeRef.current?.(...args);
//       });
//       if (setEditor) {
//         setEditor(quill);
//       }
//       return () => {
//         if (setEditor) {
//           setEditor(null);
//         }
//         if (ref && "current" in ref) {
//           (ref as MutableRefObject<Quill | null>).current = null;
//         }
//         container.innerHTML = "";
//       };
//     }, [ref]);

//     return <div className="h-[30vh] mb-10" ref={containerRef}></div>;
//   }
// );

// Editor.displayName = "Editor";

// export default Editor;
