import 'snabbdom-timeline';
export type WorldStats = {
    entityCount: number;
    componentCount: {
        [componentName: string]: number;
    };
    systems: {
        name: string;
        timeElapsed: number;
        filters: {
            [filterId: string]: number;
        };
    }[];
};
export type World = {
    stats: WorldStats;
};
export type DevtoolsOptions = {
    /**
     * start expanded. Defaults to the last persisted state, or true
     */
    open?: boolean;
    /**
     * key that toggles the panel. Default '`'. pass false to disable
     */
    hotkey?: string | false;
    /**
     * minimum milliseconds between samples. Default 250
     */
    sampleRate?: number;
    /**
     * number of samples kept in each graph. Default 100
     */
    maxSamples?: number;
    /**
     * initial panel width in pixels. Defaults to the last persisted width, or 420
     */
    width?: number;
    /**
     * optional label shown in the panel header (handy with multiple worlds)
     */
    name?: string;
    /**
     * element the panel is attached to. Default document.body
     */
    parent?: HTMLElement;
};
export type Devtools = {
    /**
     * expand the panel
     */
    open: () => void;
    /**
     * collapse the panel
     */
    close: () => void;
    /**
     * toggle the panel
     */
    toggle: () => void;
    /**
     * remove the panel and detach from the world
     */
    destroy: () => void;
    /**
     * the host element containing the panel's shadow root
     */
    element: HTMLElement;
};
/**
 * Attach a devtools panel to a world.
 * @param {World} world
 * @param {DevtoolsOptions} [options]
 * @returns {Devtools}
 */
export declare function createDevtools(world: World, options?: DevtoolsOptions): Devtools;
export default createDevtools;
//# sourceMappingURL=index.d.ts.map