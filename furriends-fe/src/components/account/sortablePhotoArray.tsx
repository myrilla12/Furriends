// photo array displaying photos in a row
// allows drag & drop to rearrange photos; and 'x' button to delete
import React from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { Image, Text } from '@mantine/core';
import { XMarkIcon } from '@heroicons/react/24/outline';

type SortablePhotoArrayProps = {
    photoUrls: string[] | null;
    setPhotoUrls: React.Dispatch<React.SetStateAction<string[] | null>>;
}

export default function SortablePhotoArray({ photoUrls, setPhotoUrls }: SortablePhotoArrayProps) {
    const onDragEnd = (result: DropResult) => {
        if (!result.destination || !photoUrls) return; // if either is null/undefined, return early

        const items = Array.from(photoUrls); // create shallow copy of photos array (immuntability principle)
        const [reorderedItem] = items.splice(result.source.index, 1); // remove the dragged item from its original position
        items.splice(result.destination.index, 0, reorderedItem); // insert the dragged item back into the array, at the new position it is dropped

        setPhotoUrls(items); // update state
    };

    // filter the current url array to remove the deleted photo, if array is null/undefined, set to null
    const handleRemove = (index: number) => {
        setPhotoUrls((prevUrls) => prevUrls ? prevUrls.filter((_, i) => i !== index) : null);
    };

    return (
        <>
            {photoUrls && photoUrls.length > 0 && <Text size="sm" fw={630}>Photos</Text>}
            <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId="photos" direction="horizontal">
                    {(provided) => (
                        <div
                            className="flex space-x-2"
                            {...provided.droppableProps}
                            ref={provided.innerRef}
                        >
                            {photoUrls && photoUrls.map((url, index) => (
                                <Draggable key={url} draggableId={url} index={index}>
                                    {(provided) => (
                                        <div
                                            className="relative"
                                            ref={provided.innerRef}
                                            {...provided.draggableProps}
                                            {...provided.dragHandleProps}
                                        >
                                            <Image src={url} alt={`photo-${index}`} width={100} height={100} className="rounded-lg" />
                                            <button
                                                type="button"
                                                className="absolute top-0 right-0 bg-white opacity-60 text-black rounded p-1"
                                                onClick={() => handleRemove(index)}
                                            >
                                                <XMarkIcon className="h-4 w-4" />
                                            </button>
                                        </div>
                                    )}
                                </Draggable>
                            ))}
                            {provided.placeholder}
                        </div>
                    )}
                </Droppable>
            </DragDropContext>
        </>
    );
};