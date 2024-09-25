import { useRef, useState, useEffect } from "react"
import { Box, VStack, HStack } from "@chakra-ui/react"
import { Editor } from "@monaco-editor/react"
import { CODE_SNIPPETS } from "../constants.js"
import LanguageSelector from "./LanguageSelector.jsx"
import  Output  from "./Output.jsx"

import io from 'socket.io-client';

const socket = io('http://localhost:8001');

const CodeEditor = () => {
    const editorRef = useRef();
    const [value, setValue] = useState("");
    const [language, setLanguage] = useState("javascript");
    const userChangeRef = useRef(false); // Flag to prevent infinite loop by tracking user-initiated changes

    const onMount = (editor) => {
        editorRef.current = editor;
        editor.focus();
        //editorRef.current.onDidChangeModelContent(() => { handleEdit(); });
    };

    const onSelect = (language) => {
        setLanguage(language);
        setValue(CODE_SNIPPETS[language]);
        console.log("language selected");
        socket.emit('selectLanguage', language);
    };

    useEffect(() => {
        socket.on('updateContent',
            (updatedContent) => {
                if (editorRef.current.getValue() === updatedContent) return;
                userChangeRef.current = false; // Set flag to false for server-initiated changes
                setValue(updatedContent);
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

    const handleEdit = () => {
        const updatedContent = editorRef.current.getValue();
        setValue(updatedContent);
        if (userChangeRef.current) {
            console.log("content updated");
            socket.emit('edit', updatedContent);
        }
        userChangeRef.current = true; // Reset flag to true for user-initiated changes
    };

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
                        onChange={handleEdit}
                    />
                </Box>
                <Output editorRef={editorRef} language={language}/>
            </HStack>
        </Box>
    )
}

export default CodeEditor;