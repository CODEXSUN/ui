import React from 'react';
import {FileUpload, type FileUploadProps, type FileSelectionProps} from '../src/blocks/file-upload.js';
export const selections = <><FileUpload selectionOnly compact/><FileUpload onUpload={async()=>({id:'confirmed'})}/></>;
// @ts-expect-error Normal upload mode must still provide a persistence callback.
export const missing = <FileUpload/>;
// @ts-expect-error Explicit normal mode cannot silently lose its handler.
export const normalMissing = <FileUpload selectionOnly={false}/>;

// Existing generated host adapters must keep a required normal-upload callback.
export function ExistingUploadAdapter(props: Pick<FileUploadProps, 'onUpload' | 'onFilesChange' | 'disabled'>) { return <FileUpload {...props}/>; }
export const selectedOnly: FileSelectionProps = {selectionOnly:true};
export const dynamicMode = (selectionOnly: boolean) => <FileUpload selectionOnly={selectionOnly} onUpload={async()=>({id:'confirmed'})}/>;
