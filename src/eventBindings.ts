import { HTMLProps } from "react";

const logEvent = e => console.log(e.type)

export const eventBindings: HTMLProps<HTMLDivElement> = {
    onCopy: logEvent,
    onCut: logEvent,
    onPaste: logEvent,

    // Composition Events
    onCompositionEnd: logEvent,
    onCompositionStart: logEvent,
    onCompositionUpdate: logEvent,

    // Focus Events
    onFocus: logEvent,
    onBlur: logEvent,

    // Form Events
    onChange: logEvent,
    onBeforeInput: logEvent,
    onInput: logEvent,
    onReset: logEvent,
    onSubmit: logEvent,
    onInvalid: logEvent,

    // Image Events
    onLoad: logEvent,
    onError: logEvent,

    // Keyboard Events
    onKeyDown: logEvent,
    onKeyPress: logEvent,
    onKeyUp: logEvent,

    // Media Events
    onAbort: logEvent,
    onCanPlay: logEvent,
    onCanPlayThrough: logEvent,
    onDurationChange: logEvent,
    onEmptied: logEvent,
    onEncrypted: logEvent,
    onEnded: logEvent,
    onLoadedData: logEvent,
    onLoadedMetadata: logEvent,
    onLoadStart: logEvent,
    onPause: logEvent,
    onPlay: logEvent,
    onPlaying: logEvent,
    onProgress: logEvent,
    onRateChange: logEvent,
    onSeeked: logEvent,
    onSeeking: logEvent,
    onStalled: logEvent,
    onSuspend: logEvent,
    onTimeUpdate: logEvent,
    onVolumeChange: logEvent,
    onWaiting: logEvent,

    // MouseEvents
    onAuxClick: logEvent,
    onClick: logEvent,
    onContextMenu: logEvent,
    onDoubleClick: logEvent,
    onDrag: logEvent,
    onDragEnd: logEvent,
    onDragEnter: logEvent,
    onDragExit: logEvent,
    onDragLeave: logEvent,
    onDragOver: logEvent,
    onDragStart: logEvent,
    onDrop: logEvent,
    onMouseDown: logEvent,
    // onMouseEnter: logEvent, // YES
    // onMouseLeave: logEvent, // YES
    // onMouseMove: logEvent, // YES

    // onMouseOut: logEvent, // YES
    // onMouseOver: logEvent, // YES
    onMouseUp: logEvent,

    // Selection Events
    onSelect: logEvent,

    // Touch Events
    onTouchCancel: logEvent,
    onTouchEnd: logEvent,
    onTouchMove: logEvent,
    onTouchStart: logEvent,

    // Pointer Events
    onPointerDown: logEvent,
    // onPointerMove: logEvent, // YES

    onPointerUp: logEvent,
    onPointerCancel: logEvent,
    // onPointerEnter: logEvent, // YES
    // onPointerLeave: logEvent, // YES
    // onPointerOver: logEvent, // YES
    // onPointerOut: logEvent, // YES





    // UI Events
    onScroll: logEvent,

    // Wheel Events
    onWheel: logEvent,

    // Animation Events
    onAnimationStart: logEvent,
    onAnimationEnd: logEvent,
    onAnimationIteration: logEvent,

    // Transition Events
    onTransitionEnd: logEvent,

}

