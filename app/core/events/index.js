import { EventEmitter } from 'events';

var ee = new EventEmitter();

export default {
    /**
     * Setup listeners for internal events.
     *
     * @param {Object} options
     * @param {Object} options.listeners
     */
    init(options) {
        // TODO: aliases
        Object.keys(options.listeners).forEach((eventName) => {
            options.listeners[eventName].forEach((handler) => {
                this.on(eventName, handler);
            });
        });
    },

    /**
     * Subscribes on event.
     *
     * @param {String} event - event name.
     * @param {Function} callback - event handler.
     *
     * @returns {this}
     */
    on(event, callback) {
        ee.on(event, callback);

        return this;
    },

    /**
     * Unsubscribes from event.
     *
     * @param {String} event - event name.
     * @param {Function} callback - event handler.
     *
     * @returns {this}
     */
    off(event, callback) {
        ee.removeListener(event, callback);

        return this;
    },

    /**
     * Emits event with data.
     *
     * @returns {this}
     */
    emit() {
        ee.emit.apply(ee, arguments);

        return this;
    }
};
