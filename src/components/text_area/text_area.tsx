import React, { useEffect, useRef, useImperativeHandle, forwardRef } from 'react';
import EditorJS, { Dictionary, OutputData } from '@editorjs/editorjs';
import Header from '@editorjs/header';
import SimpleImage from '@editorjs/simple-image';
import List from '@editorjs/list';
import Checklist from '@editorjs/checklist';
import Quote from '@editorjs/quote';
import Warning from '@editorjs/warning';
import Marker from '@editorjs/marker';
import CodeTool from '@editorjs/code';
import Delimiter from '@editorjs/delimiter';
import Strikethrough from '@sotaproject/strikethrough';
import Tooltip from 'editorjs-tooltip';
import Embed from '@editorjs/embed';
import Table from '@editorjs/table';
import Link from '@editorjs/link';
import Comment from 'editorjs-comment';
import TextColorPlugin from 'editorjs-text-color-plugin';
import Paragraph from '@editorjs/paragraph';
import Container from 'react-bootstrap/Container';

const _ = (classes: string[]): string => {
    let s = "";
    classes.forEach((i) => (s += i + " "));
    return s.trim();
};

interface Props {
    prefilledData: Dictionary;
    setPrefilledData: (data: OutputData) => void;
}

const TextArea = forwardRef(({ prefilledData, setPrefilledData }: Props, ref) => {
    const editorInstance = useRef<EditorJS | null>(null);
    const debounceTimeout = useRef<number | null>(null);

    useEffect(() => {
        if (!editorInstance.current) {
            editorInstance.current = new EditorJS({
                holder: 'editorjs',
                tools: {
                    header: {
                        class: Header,
                        inlineToolbar: true,
                        config: {
                            placeholder: 'Enter a header',
                            levels: [1, 2, 3, 4, 5, 6],
                        },
                    },
                    image: SimpleImage,
                    list: List,
                    checklist: {
                        class: Checklist,
                        inlineToolbar: true,
                        config: {
                            placeholder: 'Add a checklist item',
                            itemPlaceholder: 'Enter item',
                        },
                    },
                    quote: {
                        class: Quote,
                        inlineToolbar: true,
                        config: {
                            quotePlaceholder: 'Quote',
                            captionPlaceholder: 'Quote caption',
                        },
                    },
                    warning: {
                        class: Warning,
                        inlineToolbar: true,
                        config: {
                            titlePlaceholder: 'Warning title',
                            messagePlaceholder: 'Warning message',
                        },
                    },
                    // marker: Marker,
                    code: {
                        class: CodeTool,
                        inlineToolbar: true,
                        config: {
                            placeholder: 'Enter code',
                        },
                    },
                    delimiter: {
                        class: Delimiter,
                        inlineToolbar: false,
                    },
                    strikethrough: Strikethrough,
                    // comment: Comment,
                    // link: Link,
                    embed: {
                        class: Embed,
                        inlineToolbar: true,
                        config: {
                            services: {
                                youtube: true,       // YouTube videos
                                vimeo: true,         // Vimeo videos
                                twitter: true,       // Twitter tweets
                                facebook: true,      // Facebook posts
                                instagram: true,     // Instagram posts
                                linkedin: true,      // LinkedIn posts
                                soundcloud: true,    // SoundCloud tracks
                                twitch: true,        // Twitch streams
                                dailymotion: true,   // Dailymotion videos
                                mixcloud: true,      // Mixcloud tracks
                                reddit: true,        // Reddit posts
                                pinterest: true,     // Pinterest pins
                                gitHubGist: true,    // GitHub Gists
                                spotify: true,       // Spotify tracks or playlists
                                // Add any other services you want to support here
                            },
                            // endpoints: {
                            //     byUrl: 'http://localhost:8008/fetchUrl', // Your backend URL to handle URL parsing
                            // },
                            defaultService: 'youtube', // Default service if URL does not match any service
                            placeholder: 'Paste your embed URL here', // Placeholder text for the input field
                        },
                    },
                    table: Table,
                    // tooltip: Tooltip,
                    textcolorplugin: TextColorPlugin,
                    paragraph: {
                        class: Paragraph,
                        inlineToolbar: true,
                        config: {
                            placeholder: 'Write something...',
                        },
                    },
                },
                autofocus: true,
                data: prefilledData,
            });
        }

        return () => {
            if (editorInstance.current) {
                editorInstance.current.destroy();
                editorInstance.current = null;
            }
        };
    }, [prefilledData]);

    useImperativeHandle(ref, () => ({
        saveData: async () => {
            if (editorInstance.current) {
                try {
                    const outputData: OutputData = await editorInstance.current.save();
                    setPrefilledData(outputData);
                } catch (error) {
                    console.error('Saving failed: ', error);
                }
            }
        },
        get_content: async () => {
            if (editorInstance.current) {
                try {
                    const outputData: OutputData = await editorInstance.current.save();
                    return outputData
                } catch (error) {
                    console.error('Saving failed: ', error);
                }
            }
        },
    }));

    return (
        <Container>
            <div id="editorjs" style={{ marginBottom: '20px' }} />
        </Container>
    );
});

export default TextArea;
