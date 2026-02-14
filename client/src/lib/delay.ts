export const DELAY_MIN = 500;
export const DELAY_MAX = 1500;

/**
 * Simulates a network delay.
 * @param ms Optional specific delay in milliseconds. If not provided, a random delay between DELAY_MIN and DELAY_MAX is used.
 */
export async function delay(ms?: number): Promise<void> {
    const duration = ms ?? (Math.floor(Math.random() * (DELAY_MAX - DELAY_MIN + 1)) + DELAY_MIN);
    return new Promise((resolve) => setTimeout(resolve, duration));
}
