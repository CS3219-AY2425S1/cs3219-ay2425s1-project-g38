import { useRef, useState, useEffect } from "react"
import { Box, VStack, HStack } from "@chakra-ui/react"
import { Editor } from "@monaco-editor/react"
import { CODE_SNIPPETS } from "../constants.js"
import LanguageSelector from "./LanguageSelector.jsx"
import  Output  from "./Output.jsx"
import * as Y from 'yjs';
import { MonacoBinding } from 'y-monaco';

import io from 'socket.io-client';
import { socket } from '../services/socketService.js';


const CodeEditor = () => {
    const doc = new Y.Doc();
    const yText = doc.getText('code');
    const editorRef = useRef();
    const [value, setValue] = useState("");
    const [language, setLanguage] = useState("javascript");
    const userChangeRef = useRef(false); // Flag to prevent infinite loop by tracking user-initiated changes

    const onMount = (editor) => {
        editorRef.current = editor;
        const binding = new MonacoBinding(yText, editorRef.current.getModel(), new Set([editorRef.current]));
        // due to the binding above, on update of editor, yText updates, and the doc is also updated
        // so we can listen to changes in doc and emit them to the server
        doc.on('update', (update) => {
            // Edits are handled here
            console.log("update", update);
            socket.emit('update', update)
        });

    };

    const onSelect = (language) => {
        console.log("language", language);
        setLanguage(language);

        // Set the editor value to the code snippet for the selected language
        setValue(CODE_SNIPPETS[language]);
        console.log("language selected");

        // Emit the selected language and code snippet to the server
        socket.emit('selectLanguage', language);
        socket.emit('edit', CODE_SNIPPETS[language]);
    };

    useEffect(() => {
        socket.on('initialData', (data) => {
            const { sessionData } = data;
            const  {
                questionDescription,
                questionTemplateCode,
                questionTestcases,
                yDocUpdate,
                partnerJoined
            } = sessionData;

            // After Uint8Array is sent through a socker, it reverts to a buffer
            Y.applyUpdate(doc, new Uint8Array(yDocUpdate));

        });

        socket.on('updateContent',
            (update) => {
                console.log("updateContent", update);
                update = new Uint8Array(update);
                Y.applyUpdate(doc, update);
            });

        socket.on('updateLanguage',
            (updatedLanguage) => {
                setLanguage(updatedLanguage);
            });

        return () => {
            socket.off('updateContent');
            socket.off('updateLanguage');
        };
    });



    return (
        <Box>
            <HStack spacing={4}>
                <Box w="50%">
                    <LanguageSelector language={language} onSelect={onSelect}/>
                    <Editor
                        height="75vh"
                        width={"100%"}
                        theme="vs-dark"
                        language={language}
                        defaultValue={CODE_SNIPPETS[language]}
                        onMount={onMount}
                        value={value}
                    />
                </Box>
                <Output editorRef={editorRef} language={language}/>
            </HStack>
        </Box>
    )
}

export default CodeEditor;
