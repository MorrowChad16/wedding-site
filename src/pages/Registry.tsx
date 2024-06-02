import { useRef, useEffect } from 'react';
import PageContainer from '../components/PageContainer';

export default function Registry() {
    const iframeRef = useRef<HTMLIFrameElement>(null);

    useEffect(() => {
        const iframeElement = iframeRef.current;

        if (iframeElement) {
            const existingScript = iframeElement.contentWindow?.document.getElementById(
                'script_myregistry_giftlist_iframe'
            );

            if (!existingScript) {
                const script = document.createElement('script');
                script.id = 'script_myregistry_giftlist_iframe';
                script.type = 'text/javascript';
                script.src =
                    '//www.myregistry.com//Visitors/GiftList/iFrames/EmbedRegistry.ashx?r=5TnbR-HS3gjqRIHsBb0fMQ2&v=2';

                iframeElement.contentWindow?.document.body.appendChild(script);
            }
        }
    }, []);

    return (
        <PageContainer>
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    height: '180vh',
                    overflow: 'hidden',
                }}
            >
                <iframe ref={iframeRef} title="MyRegistry" style={{ flex: 1, border: 'none' }} />
            </div>
        </PageContainer>
    );
}
