import {useEffect, useRef, useState} from "react";
import {OverlayPanel} from "primereact/overlaypanel";

const WatchingIcon = ({
                          speed = "medium",
                          text = "",
                          noAnimation = false,
                          connected = true,
                          lostConnectionText = "Son Kontrol Saati"
                      }: {
    speed?: "slow" | "medium" | "fast",
    text?: string,
    noAnimation?: boolean,
    connected?: boolean,
    lostConnectionText?: string
}) => {
    const op = useRef<OverlayPanel>(null);
    const [time, setTime] = useState(new Date());
    const [threeDots, setThreeDots] = useState("...");
    const [timeIntervalId, setTimeIntervalId] = useState(0);
    const [threeDotsIntervalId, setThreeDotsIntervalId] = useState(0);
    useEffect(() => {
        let id = setInterval(() => {
            if (connected) {
                setTime(new Date());
            }
        }, 1000);
        setTimeIntervalId(Number(id));

        return () => clearInterval(id); // Temizleme işlemi
    }, []);
    useEffect(() => {
        const id = setInterval(() => {
            if (connected) {
                setThreeDots((prev) => {
                    if (prev === "...") {
                        return ".";
                    } else if (prev === ".") {
                        return "..";
                    } else if (prev === "..") {
                        return "...";
                    }
                    return "...";
                });
            }
        }, 300);
        setThreeDotsIntervalId(Number(id));
        return () => clearInterval(id);
    }, []);
    useEffect(() => {
        if (!connected) {
            clearInterval(threeDotsIntervalId);
            clearInterval(timeIntervalId);
            setThreeDots("");
        }
    }, [connected]);
    return <>
        <OverlayPanel
            ref={op}
            style={{
                width: "200px",
            }}
        >
            {connected ? text : lostConnectionText}<span className={"text-teal-600"}>{threeDots}</span>
            <br/>
            {time.toLocaleDateString()} <span className={"text-teal-600"}>{time.toLocaleTimeString()}</span>
        </OverlayPanel>
        <div className={`blinking-dot ${speed} ${noAnimation ? "no-animation" : ""} ${connected ? "" : "red no-animation"} `}
             onClick={(event) => op.current?.toggle(event)}/>
    </>
}
export default WatchingIcon;
