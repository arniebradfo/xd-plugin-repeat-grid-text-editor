import React, { useEffect, useRef } from "react";

/** 
 * react event wrapper for web components?
 * https://www.adobe.io/xd/uxp/uxp/reference-spectrum/Overview/Using%20with%20React/#event-handling
 * https://github.com/AdobeDocs/uxp-photoshop-plugin-samples/blob/main/ui-react-starter/src/components/WC.jsx
 */
export const WC = (props) => {
    const elRef = useRef<HTMLDivElement>(null);

    const handleEvent = (evt) => {
        const propName = `on${evt.type[0].toUpperCase()}${evt.type.substr(1)}`;
        console.log(propName);
        
        if (props[propName]) {
            props[propName].call(evt.target, evt);
        }
    };

    useEffect(() => {

        const el = elRef.current!;
        const eventProps = Object.entries(props).filter(([k, v]) =>
            k.startsWith("on")
        );
        eventProps.forEach(([k, v]) =>
            el.addEventListener(k.substr(2).toLowerCase(), handleEvent)
        );

        return () => {
            const el = elRef.current!;
            const eventProps = Object.entries(props).filter(([k, v]) =>
                k.startsWith("on")
            );
            eventProps.forEach(([k, v]) =>
                el.removeEventListener(k.substr(2).toLowerCase(), handleEvent)
            );
        };

    }, []);

    return (
        <div ref={elRef} {...props}>
            {props.children}
        </div>
    );
};