import React from 'react'
import { useSelector } from 'react-redux'

export const TestsList = () => {
    const tests = useSelector((state:any) => state.tests)

    const renderedTests = tests.map((test:any) => (
        <article className="test-excerpt" key={test.id}>
            <h3>{test.title}</h3>
            <p className="test-content">{test.author_id}</p>
            <p className="test-content">{test.created_at}</p>
        </article>
    ))

    return (
        <section className="tests-list">
            <h2>Tests</h2>
            {renderedTests}
        </section>
    )
}