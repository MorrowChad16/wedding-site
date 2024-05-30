import * as React from 'react';
import { QuestionAnswerBox } from '../components/question-box';
import PageContainer from '../components/PageContainer';

export default function FAQ() {
    const [expandedPanels, setExpandedPanels] = React.useState<string[]>([]);

    const handlePanelChange = (panelId: string) => {
        setExpandedPanels((prevPanels) => {
            if (prevPanels.includes(panelId)) {
                return prevPanels.filter((id) => id !== panelId);
            } else {
                return [...prevPanels, panelId];
            }
        });
    };

    interface FaqItem {
        id: string;
        question: string;
        answer: string;
    }

    const faqItems: FaqItem[] = [
        { id: 'q1', question: 'How should I book my travel and stay?', answer: '...' },
        { id: 'q2', question: 'What is the schedule of events for the wedding?', answer: '...' },
        { id: 'q3', question: 'What is the dress code of the wedding?', answer: '...' },
        { id: 'q4', question: 'Where will the wedding and ceremony be?', answer: '...' },
        { id: 'q5', question: 'How do I get to X from the airport?', answer: '...' },
        { id: 'q6', question: 'When do I need to RSVP by?', answer: '...' },
        { id: 'q7', question: 'Can I bring a date?', answer: '...' },
        { id: 'q8', question: 'Can we bring our children?', answer: '...' },
        {
            id: 'q9',
            question: 'I have a dietary restriction, will there be food for me?',
            answer: '...',
        },
        { id: 'q10', question: 'Is there parking available?', answer: '...' },
        { id: 'q11', question: 'What is the shuttle service?', answer: '...' },
        { id: 'q12', question: 'Can I take pictures during the ceremony?', answer: '...' },
        { id: 'q13', question: 'Will there be drinks available?', answer: '...' },
        { id: 'q14', question: 'Registry', answer: '...' },
        { id: 'q15', question: 'Any additional questions?', answer: '...' },
    ];

    return (
        <PageContainer>
            <div>
                {faqItems.map((item) => (
                    <QuestionAnswerBox
                        key={item.id}
                        question={item.question}
                        answer={item.answer}
                        expanded={expandedPanels.includes(item.id)}
                        handleChange={() => handlePanelChange(item.id)}
                    />
                ))}
            </div>
        </PageContainer>
    );
}
