export interface RcaVerdict {
    severity: string;
    priority: string;
    rootCause: string;
    fixes: string[];
}

export async function analyzeFailure(_input: {
    title: string;
    file: string;
    error: string;
    stack?: string;
}): Promise<RcaVerdict> {
    return {
        severity: 'Medium',
        priority: 'P1',
        rootCause: 'AI analysis not configured',
        fixes: ['Set up LLM API key for AI-powered RCA'],
    };
}
