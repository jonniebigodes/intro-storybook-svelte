
(function(l, r) { if (l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (window.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.head.appendChild(r) })(window.document);
var app = (function () {
    'use strict';

    function noop() { }
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }
    function validate_store(store, name) {
        if (!store || typeof store.subscribe !== 'function') {
            throw new Error(`'${name}' is not a store with a 'subscribe' method`);
        }
    }
    function subscribe(store, callback) {
        const unsub = store.subscribe(callback);
        return unsub.unsubscribe ? () => unsub.unsubscribe() : unsub;
    }
    function component_subscribe(component, store, callback) {
        component.$$.on_destroy.push(subscribe(store, callback));
    }

    function append(target, node) {
        target.appendChild(node);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        node.parentNode.removeChild(node);
    }
    function destroy_each(iterations, detaching) {
        for (let i = 0; i < iterations.length; i += 1) {
            if (iterations[i])
                iterations[i].d(detaching);
        }
    }
    function element(name) {
        return document.createElement(name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function empty() {
        return text('');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function prevent_default(fn) {
        return function (event) {
            event.preventDefault();
            // @ts-ignore
            return fn.call(this, event);
        };
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else
            node.setAttribute(attribute, value);
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function set_style(node, key, value, important) {
        node.style.setProperty(key, value, important ? 'important' : '');
    }
    function custom_event(type, detail) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, false, false, detail);
        return e;
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }
    function createEventDispatcher() {
        const component = current_component;
        return (type, detail) => {
            const callbacks = component.$$.callbacks[type];
            if (callbacks) {
                // TODO are there situations where events could be dispatched
                // in a server (non-DOM) environment?
                const event = custom_event(type, detail);
                callbacks.slice().forEach(fn => {
                    fn.call(component, event);
                });
            }
        };
    }
    // TODO figure out if we still want to support
    // shorthand events, or if we want to implement
    // a real bubbling mechanism
    function bubble(component, event) {
        const callbacks = component.$$.callbacks[event.type];
        if (callbacks) {
            callbacks.slice().forEach(fn => fn(event));
        }
    }

    const dirty_components = [];
    const binding_callbacks = [];
    const render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    function flush() {
        const seen_callbacks = new Set();
        do {
            // first, call beforeUpdate functions
            // and update components
            while (dirty_components.length) {
                const component = dirty_components.shift();
                set_current_component(component);
                update(component.$$);
            }
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    callback();
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
    }
    function update($$) {
        if ($$.fragment) {
            $$.update($$.dirty);
            run_all($$.before_update);
            $$.fragment.p($$.dirty, $$.ctx);
            $$.dirty = null;
            $$.after_update.forEach(add_render_callback);
        }
    }
    const outroing = new Set();
    let outros;
    function group_outros() {
        outros = {
            r: 0,
            c: [],
            p: outros // parent group
        };
    }
    function check_outros() {
        if (!outros.r) {
            run_all(outros.c);
        }
        outros = outros.p;
    }
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function transition_out(block, local, detach, callback) {
        if (block && block.o) {
            if (outroing.has(block))
                return;
            outroing.add(block);
            outros.c.push(() => {
                outroing.delete(block);
                if (callback) {
                    if (detach)
                        block.d(1);
                    callback();
                }
            });
            block.o(local);
        }
    }

    const globals = (typeof window !== 'undefined' ? window : global);
    function mount_component(component, target, anchor) {
        const { fragment, on_mount, on_destroy, after_update } = component.$$;
        fragment.m(target, anchor);
        // onMount happens before the initial afterUpdate
        add_render_callback(() => {
            const new_on_destroy = on_mount.map(run).filter(is_function);
            if (on_destroy) {
                on_destroy.push(...new_on_destroy);
            }
            else {
                // Edge case - component was destroyed immediately,
                // most likely as a result of a binding initialising
                run_all(new_on_destroy);
            }
            component.$$.on_mount = [];
        });
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        if (component.$$.fragment) {
            run_all(component.$$.on_destroy);
            component.$$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            component.$$.on_destroy = component.$$.fragment = null;
            component.$$.ctx = {};
        }
    }
    function make_dirty(component, key) {
        if (!component.$$.dirty) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty = blank_object();
        }
        component.$$.dirty[key] = true;
    }
    function init(component, options, instance, create_fragment, not_equal, prop_names) {
        const parent_component = current_component;
        set_current_component(component);
        const props = options.props || {};
        const $$ = component.$$ = {
            fragment: null,
            ctx: null,
            // state
            props: prop_names,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            before_update: [],
            after_update: [],
            context: new Map(parent_component ? parent_component.$$.context : []),
            // everything else
            callbacks: blank_object(),
            dirty: null
        };
        let ready = false;
        $$.ctx = instance
            ? instance(component, props, (key, ret, value = ret) => {
                if ($$.ctx && not_equal($$.ctx[key], $$.ctx[key] = value)) {
                    if ($$.bound[key])
                        $$.bound[key](value);
                    if (ready)
                        make_dirty(component, key);
                }
                return ret;
            })
            : props;
        $$.update();
        ready = true;
        run_all($$.before_update);
        $$.fragment = create_fragment($$.ctx);
        if (options.target) {
            if (options.hydrate) {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment.l(children(options.target));
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor);
            flush();
        }
        set_current_component(parent_component);
    }
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set() {
            // overridden by instance, if it has props
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, detail));
    }
    function append_dev(target, node) {
        dispatch_dev("SvelteDOMInsert", { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev("SvelteDOMInsert", { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev("SvelteDOMRemove", { node });
        detach(node);
    }
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation) {
        const modifiers = options === true ? ["capture"] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
        dispatch_dev("SvelteDOMAddEventListener", { node, event, handler, modifiers });
        const dispose = listen(node, event, handler, options);
        return () => {
            dispatch_dev("SvelteDOMRemoveEventListener", { node, event, handler, modifiers });
            dispose();
        };
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev("SvelteDOMRemoveAttribute", { node, attribute });
        else
            dispatch_dev("SvelteDOMSetAttribute", { node, attribute, value });
    }
    function prop_dev(node, property, value) {
        node[property] = value;
        dispatch_dev("SvelteDOMSetProperty", { node, property, value });
    }
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error(`'target' is a required option`);
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn(`Component was already destroyed`); // eslint-disable-line no-console
            };
        }
    }

    const subscriber_queue = [];
    /**
     * Create a `Writable` store that allows both updating and reading by subscription.
     * @param {*=}value initial value
     * @param {StartStopNotifier=}start start and stop notifications for subscriptions
     */
    function writable(value, start = noop) {
        let stop;
        const subscribers = [];
        function set(new_value) {
            if (safe_not_equal(value, new_value)) {
                value = new_value;
                if (stop) { // store is ready
                    const run_queue = !subscriber_queue.length;
                    for (let i = 0; i < subscribers.length; i += 1) {
                        const s = subscribers[i];
                        s[1]();
                        subscriber_queue.push(s, value);
                    }
                    if (run_queue) {
                        for (let i = 0; i < subscriber_queue.length; i += 2) {
                            subscriber_queue[i][0](subscriber_queue[i + 1]);
                        }
                        subscriber_queue.length = 0;
                    }
                }
            }
        }
        function update(fn) {
            set(fn(value));
        }
        function subscribe(run, invalidate = noop) {
            const subscriber = [run, invalidate];
            subscribers.push(subscriber);
            if (subscribers.length === 1) {
                stop = start(set) || noop;
            }
            run(value);
            return () => {
                const index = subscribers.indexOf(subscriber);
                if (index !== -1) {
                    subscribers.splice(index, 1);
                }
                if (subscribers.length === 0) {
                    stop();
                    stop = null;
                }
            };
        }
        return { set, update, subscribe };
    }

    //initial code
    const TaskBox = () => {
      const { subscribe, update } = writable([
        { id: "1", title: "Something", state: "TASK_INBOX" },
        { id: "2", title: "Something more", state: "TASK_INBOX" },
        { id: "3", title: "Something else", state: "TASK_INBOX" },
        { id: "4", title: "Something again", state: "TASK_INBOX" }
      ]);

      return {
        subscribe,
        archiveTask: id =>
          update(tasks => tasks.map(task =>
            task.id === id ? { ...task, state: "TASK_ARCHIVED" } : task
          )),
        pinTask: id =>
          update(tasks =>  tasks.map(task =>
            task.id === id ? { ...task, state: "TASK_PINNED" } : task
          ))
      };
    };
    const taskStore = TaskBox();

    const appState = () => {
      const { subscribe, update } = writable(false);
      return {
        subscribe,
        error: () => update(error => !error)
      };
    };

    const AppStore = appState();

    /* src\components\Task.svelte generated by Svelte v3.12.1 */
    const { console: console_1 } = globals;

    const file = "src\\components\\Task.svelte";

    // (129:4) {#if task.state !== 'TASK_ARCHIVED'}
    function create_if_block(ctx) {
    	var a, span, dispose;

    	const block = {
    		c: function create() {
    			a = element("a");
    			span = element("span");
    			attr_dev(span, "class", "icon-star");
    			add_location(span, file, 130, 8, 3060);
    			attr_dev(a, "href", "/");
    			add_location(a, file, 129, 6, 3004);
    			dispose = listen_dev(a, "click", prevent_default(ctx.PinTask), false, true);
    		},

    		m: function mount(target, anchor) {
    			insert_dev(target, a, anchor);
    			append_dev(a, span);
    		},

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach_dev(a);
    			}

    			dispose();
    		}
    	};
    	dispatch_dev("SvelteRegisterBlock", { block, id: create_if_block.name, type: "if", source: "(129:4) {#if task.state !== 'TASK_ARCHIVED'}", ctx });
    	return block;
    }

    function create_fragment(ctx) {
    	var div2, label, input0, t0, span, t1, div0, input1, input1_value_value, t2, div1, div2_class_value, dispose;

    	var if_block = (ctx.task.state !== 'TASK_ARCHIVED') && create_if_block(ctx);

    	const block = {
    		c: function create() {
    			div2 = element("div");
    			label = element("label");
    			input0 = element("input");
    			t0 = space();
    			span = element("span");
    			t1 = space();
    			div0 = element("div");
    			input1 = element("input");
    			t2 = space();
    			div1 = element("div");
    			if (if_block) if_block.c();
    			attr_dev(input0, "type", "checkbox");
    			input0.checked = ctx.isChecked;
    			input0.disabled = true;
    			attr_dev(input0, "name", "checked");
    			add_location(input0, file, 116, 4, 2605);
    			attr_dev(span, "class", "checkbox-custom");
    			add_location(span, file, 117, 4, 2680);
    			attr_dev(label, "class", "checkbox");
    			add_location(label, file, 115, 2, 2575);
    			attr_dev(input1, "type", "text");
    			input1.readOnly = true;
    			input1.value = input1_value_value = ctx.task.title;
    			attr_dev(input1, "placeholder", "Input title");
    			set_style(input1, "text-overflow", "ellipsis");
    			add_location(input1, file, 120, 4, 2776);
    			attr_dev(div0, "class", "title");
    			add_location(div0, file, 119, 2, 2751);
    			attr_dev(div1, "class", "actions");
    			add_location(div1, file, 127, 2, 2933);
    			attr_dev(div2, "class", div2_class_value = `list-item ${ctx.task.state}`);
    			add_location(div2, file, 114, 0, 2532);
    			dispose = listen_dev(span, "click", ctx.ArchiveTask);
    		},

    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},

    		m: function mount(target, anchor) {
    			insert_dev(target, div2, anchor);
    			append_dev(div2, label);
    			append_dev(label, input0);
    			append_dev(label, t0);
    			append_dev(label, span);
    			append_dev(div2, t1);
    			append_dev(div2, div0);
    			append_dev(div0, input1);
    			append_dev(div2, t2);
    			append_dev(div2, div1);
    			if (if_block) if_block.m(div1, null);
    		},

    		p: function update(changed, ctx) {
    			if (changed.isChecked) {
    				prop_dev(input0, "checked", ctx.isChecked);
    			}

    			if ((changed.task) && input1_value_value !== (input1_value_value = ctx.task.title)) {
    				prop_dev(input1, "value", input1_value_value);
    			}

    			if (ctx.task.state !== 'TASK_ARCHIVED') {
    				if (!if_block) {
    					if_block = create_if_block(ctx);
    					if_block.c();
    					if_block.m(div1, null);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}

    			if ((changed.task) && div2_class_value !== (div2_class_value = `list-item ${ctx.task.state}`)) {
    				attr_dev(div2, "class", div2_class_value);
    			}
    		},

    		i: noop,
    		o: noop,

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach_dev(div2);
    			}

    			if (if_block) if_block.d();
    			dispose();
    		}
    	};
    	dispatch_dev("SvelteRegisterBlock", { block, id: create_fragment.name, type: "component", source: "", ctx });
    	return block;
    }

    function instance($$self, $$props, $$invalidate) {
    	const dispatch = createEventDispatcher();

      // event handler for Pin Task
      function PinTask() {
        dispatch("onPinTask", {
          id: task.id
        });
      }
      // event handler for Archive Task
      function ArchiveTask() {
        console.log(`task ArchiveTask :${task.id}`);
        dispatch("onArchiveTask", {
          id: task.id
        });
      }
      //

      // props
      let { task = {
        id: "",
        title: "",
        state: "",
        updated_at: new Date(2019, 0, 1, 9, 0)
      } } = $$props;

    	const writable_props = ['task'];
    	Object.keys($$props).forEach(key => {
    		if (!writable_props.includes(key) && !key.startsWith('$$')) console_1.warn(`<Task> was created with unknown prop '${key}'`);
    	});

    	$$self.$set = $$props => {
    		if ('task' in $$props) $$invalidate('task', task = $$props.task);
    	};

    	$$self.$capture_state = () => {
    		return { task, isChecked };
    	};

    	$$self.$inject_state = $$props => {
    		if ('task' in $$props) $$invalidate('task', task = $$props.task);
    		if ('isChecked' in $$props) $$invalidate('isChecked', isChecked = $$props.isChecked);
    	};

    	let isChecked;

    	$$self.$$.update = ($$dirty = { task: 1 }) => {
    		if ($$dirty.task) { $$invalidate('isChecked', isChecked = task.state === "TASK_ARCHIVED"); }
    	};

    	return { PinTask, ArchiveTask, task, isChecked };
    }

    class Task extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, ["task"]);
    		dispatch_dev("SvelteRegisterComponent", { component: this, tagName: "Task", options, id: create_fragment.name });
    	}

    	get task() {
    		throw new Error("<Task>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set task(value) {
    		throw new Error("<Task>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\components\LoadingRow.svelte generated by Svelte v3.12.1 */

    const file$1 = "src\\components\\LoadingRow.svelte";

    function create_fragment$1(ctx) {
    	var div, span0, t0, span4, span1, t2, span2, t4, span3;

    	const block = {
    		c: function create() {
    			div = element("div");
    			span0 = element("span");
    			t0 = space();
    			span4 = element("span");
    			span1 = element("span");
    			span1.textContent = "Loading";
    			t2 = space();
    			span2 = element("span");
    			span2.textContent = "cool";
    			t4 = space();
    			span3 = element("span");
    			span3.textContent = "state";
    			attr_dev(span0, "class", "glow-checkbox");
    			add_location(span0, file$1, 1, 2, 30);
    			add_location(span1, file$1, 3, 4, 94);
    			add_location(span2, file$1, 4, 4, 120);
    			add_location(span3, file$1, 5, 4, 143);
    			attr_dev(span4, "class", "glow-text");
    			add_location(span4, file$1, 2, 2, 64);
    			attr_dev(div, "class", "loading-item");
    			add_location(div, file$1, 0, 0, 0);
    		},

    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},

    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, span0);
    			append_dev(div, t0);
    			append_dev(div, span4);
    			append_dev(span4, span1);
    			append_dev(span4, t2);
    			append_dev(span4, span2);
    			append_dev(span4, t4);
    			append_dev(span4, span3);
    		},

    		p: noop,
    		i: noop,
    		o: noop,

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach_dev(div);
    			}
    		}
    	};
    	dispatch_dev("SvelteRegisterBlock", { block, id: create_fragment$1.name, type: "component", source: "", ctx });
    	return block;
    }

    class LoadingRow extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, null, create_fragment$1, safe_not_equal, []);
    		dispatch_dev("SvelteRegisterComponent", { component: this, tagName: "LoadingRow", options, id: create_fragment$1.name });
    	}
    }

    /* src\components\PureTaskList.svelte generated by Svelte v3.12.1 */

    const file$2 = "src\\components\\PureTaskList.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = Object.create(ctx);
    	child_ctx.task = list[i];
    	return child_ctx;
    }

    // (15:0) {#if loading}
    function create_if_block_1(ctx) {
    	var div, t0, t1, t2, t3, current;

    	var loadingrow0 = new LoadingRow({ $$inline: true });

    	var loadingrow1 = new LoadingRow({ $$inline: true });

    	var loadingrow2 = new LoadingRow({ $$inline: true });

    	var loadingrow3 = new LoadingRow({ $$inline: true });

    	var loadingrow4 = new LoadingRow({ $$inline: true });

    	const block = {
    		c: function create() {
    			div = element("div");
    			loadingrow0.$$.fragment.c();
    			t0 = space();
    			loadingrow1.$$.fragment.c();
    			t1 = space();
    			loadingrow2.$$.fragment.c();
    			t2 = space();
    			loadingrow3.$$.fragment.c();
    			t3 = space();
    			loadingrow4.$$.fragment.c();
    			attr_dev(div, "class", "list-items");
    			add_location(div, file$2, 15, 2, 408);
    		},

    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(loadingrow0, div, null);
    			append_dev(div, t0);
    			mount_component(loadingrow1, div, null);
    			append_dev(div, t1);
    			mount_component(loadingrow2, div, null);
    			append_dev(div, t2);
    			mount_component(loadingrow3, div, null);
    			append_dev(div, t3);
    			mount_component(loadingrow4, div, null);
    			current = true;
    		},

    		i: function intro(local) {
    			if (current) return;
    			transition_in(loadingrow0.$$.fragment, local);

    			transition_in(loadingrow1.$$.fragment, local);

    			transition_in(loadingrow2.$$.fragment, local);

    			transition_in(loadingrow3.$$.fragment, local);

    			transition_in(loadingrow4.$$.fragment, local);

    			current = true;
    		},

    		o: function outro(local) {
    			transition_out(loadingrow0.$$.fragment, local);
    			transition_out(loadingrow1.$$.fragment, local);
    			transition_out(loadingrow2.$$.fragment, local);
    			transition_out(loadingrow3.$$.fragment, local);
    			transition_out(loadingrow4.$$.fragment, local);
    			current = false;
    		},

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach_dev(div);
    			}

    			destroy_component(loadingrow0);

    			destroy_component(loadingrow1);

    			destroy_component(loadingrow2);

    			destroy_component(loadingrow3);

    			destroy_component(loadingrow4);
    		}
    	};
    	dispatch_dev("SvelteRegisterBlock", { block, id: create_if_block_1.name, type: "if", source: "(15:0) {#if loading}", ctx });
    	return block;
    }

    // (25:0) {#if noTasks && !loading}
    function create_if_block$1(ctx) {
    	var div3, div2, span, t0, div0, t2, div1;

    	const block = {
    		c: function create() {
    			div3 = element("div");
    			div2 = element("div");
    			span = element("span");
    			t0 = space();
    			div0 = element("div");
    			div0.textContent = "You have no tasks";
    			t2 = space();
    			div1 = element("div");
    			div1.textContent = "Sit back and relax";
    			attr_dev(span, "class", "icon-check");
    			add_location(span, file$2, 27, 6, 649);
    			attr_dev(div0, "class", "title-message");
    			add_location(div0, file$2, 28, 6, 684);
    			attr_dev(div1, "class", "subtitle-message");
    			add_location(div1, file$2, 29, 6, 742);
    			attr_dev(div2, "class", "wrapper-message");
    			add_location(div2, file$2, 26, 4, 612);
    			attr_dev(div3, "class", "list-items");
    			add_location(div3, file$2, 25, 2, 582);
    		},

    		m: function mount(target, anchor) {
    			insert_dev(target, div3, anchor);
    			append_dev(div3, div2);
    			append_dev(div2, span);
    			append_dev(div2, t0);
    			append_dev(div2, div0);
    			append_dev(div2, t2);
    			append_dev(div2, div1);
    		},

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach_dev(div3);
    			}
    		}
    	};
    	dispatch_dev("SvelteRegisterBlock", { block, id: create_if_block$1.name, type: "if", source: "(25:0) {#if noTasks && !loading}", ctx });
    	return block;
    }

    // (35:0) {#each tasksInOrder as task}
    function create_each_block(ctx) {
    	var current;

    	var task = new Task({
    		props: { task: ctx.task },
    		$$inline: true
    	});
    	task.$on("onPinTask", ctx.onPinTask_handler);
    	task.$on("onArchiveTask", ctx.onArchiveTask_handler);

    	const block = {
    		c: function create() {
    			task.$$.fragment.c();
    		},

    		m: function mount(target, anchor) {
    			mount_component(task, target, anchor);
    			current = true;
    		},

    		p: function update(changed, ctx) {
    			var task_changes = {};
    			if (changed.tasksInOrder) task_changes.task = ctx.task;
    			task.$set(task_changes);
    		},

    		i: function intro(local) {
    			if (current) return;
    			transition_in(task.$$.fragment, local);

    			current = true;
    		},

    		o: function outro(local) {
    			transition_out(task.$$.fragment, local);
    			current = false;
    		},

    		d: function destroy(detaching) {
    			destroy_component(task, detaching);
    		}
    	};
    	dispatch_dev("SvelteRegisterBlock", { block, id: create_each_block.name, type: "each", source: "(35:0) {#each tasksInOrder as task}", ctx });
    	return block;
    }

    function create_fragment$2(ctx) {
    	var t0, t1, each_1_anchor, current;

    	var if_block0 = (ctx.loading) && create_if_block_1(ctx);

    	var if_block1 = (ctx.noTasks && !ctx.loading) && create_if_block$1(ctx);

    	let each_value = ctx.tasksInOrder;

    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const block = {
    		c: function create() {
    			if (if_block0) if_block0.c();
    			t0 = space();
    			if (if_block1) if_block1.c();
    			t1 = space();

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			each_1_anchor = empty();
    		},

    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},

    		m: function mount(target, anchor) {
    			if (if_block0) if_block0.m(target, anchor);
    			insert_dev(target, t0, anchor);
    			if (if_block1) if_block1.m(target, anchor);
    			insert_dev(target, t1, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(target, anchor);
    			}

    			insert_dev(target, each_1_anchor, anchor);
    			current = true;
    		},

    		p: function update(changed, ctx) {
    			if (ctx.loading) {
    				if (!if_block0) {
    					if_block0 = create_if_block_1(ctx);
    					if_block0.c();
    					transition_in(if_block0, 1);
    					if_block0.m(t0.parentNode, t0);
    				} else transition_in(if_block0, 1);
    			} else if (if_block0) {
    				group_outros();
    				transition_out(if_block0, 1, 1, () => {
    					if_block0 = null;
    				});
    				check_outros();
    			}

    			if (ctx.noTasks && !ctx.loading) {
    				if (!if_block1) {
    					if_block1 = create_if_block$1(ctx);
    					if_block1.c();
    					if_block1.m(t1.parentNode, t1);
    				}
    			} else if (if_block1) {
    				if_block1.d(1);
    				if_block1 = null;
    			}

    			if (changed.tasksInOrder) {
    				each_value = ctx.tasksInOrder;

    				let i;
    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(changed, child_ctx);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
    					}
    				}

    				group_outros();
    				for (i = each_value.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}
    				check_outros();
    			}
    		},

    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block0);

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},

    		o: function outro(local) {
    			transition_out(if_block0);

    			each_blocks = each_blocks.filter(Boolean);
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},

    		d: function destroy(detaching) {
    			if (if_block0) if_block0.d(detaching);

    			if (detaching) {
    				detach_dev(t0);
    			}

    			if (if_block1) if_block1.d(detaching);

    			if (detaching) {
    				detach_dev(t1);
    			}

    			destroy_each(each_blocks, detaching);

    			if (detaching) {
    				detach_dev(each_1_anchor);
    			}
    		}
    	};
    	dispatch_dev("SvelteRegisterBlock", { block, id: create_fragment$2.name, type: "component", source: "", ctx });
    	return block;
    }

    function instance$1($$self, $$props, $$invalidate) {
    	
      let { loading = false, tasks = [] } = $$props;

    	const writable_props = ['loading', 'tasks'];
    	Object.keys($$props).forEach(key => {
    		if (!writable_props.includes(key) && !key.startsWith('$$')) console.warn(`<PureTaskList> was created with unknown prop '${key}'`);
    	});

    	function onPinTask_handler(event) {
    		bubble($$self, event);
    	}

    	function onArchiveTask_handler(event) {
    		bubble($$self, event);
    	}

    	$$self.$set = $$props => {
    		if ('loading' in $$props) $$invalidate('loading', loading = $$props.loading);
    		if ('tasks' in $$props) $$invalidate('tasks', tasks = $$props.tasks);
    	};

    	$$self.$capture_state = () => {
    		return { loading, tasks, noTasks, emptyTasks, tasksInOrder };
    	};

    	$$self.$inject_state = $$props => {
    		if ('loading' in $$props) $$invalidate('loading', loading = $$props.loading);
    		if ('tasks' in $$props) $$invalidate('tasks', tasks = $$props.tasks);
    		if ('noTasks' in $$props) $$invalidate('noTasks', noTasks = $$props.noTasks);
    		if ('emptyTasks' in $$props) emptyTasks = $$props.emptyTasks;
    		if ('tasksInOrder' in $$props) $$invalidate('tasksInOrder', tasksInOrder = $$props.tasksInOrder);
    	};

    	let noTasks, emptyTasks, tasksInOrder;

    	$$self.$$.update = ($$dirty = { tasks: 1, loading: 1 }) => {
    		if ($$dirty.tasks) { $$invalidate('noTasks', noTasks = tasks.length === 0); }
    		if ($$dirty.tasks || $$dirty.loading) { emptyTasks = tasks.length === 0 && !loading; }
    		if ($$dirty.tasks) { $$invalidate('tasksInOrder', tasksInOrder = [
            ...tasks.filter(t => t.state === "TASK_PINNED"),
            ...tasks.filter(t => t.state !== "TASK_PINNED")
          ]); }
    	};

    	return {
    		loading,
    		tasks,
    		noTasks,
    		tasksInOrder,
    		onPinTask_handler,
    		onArchiveTask_handler
    	};
    }

    class PureTaskList extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$2, safe_not_equal, ["loading", "tasks"]);
    		dispatch_dev("SvelteRegisterComponent", { component: this, tagName: "PureTaskList", options, id: create_fragment$2.name });
    	}

    	get loading() {
    		throw new Error("<PureTaskList>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set loading(value) {
    		throw new Error("<PureTaskList>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get tasks() {
    		throw new Error("<PureTaskList>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set tasks(value) {
    		throw new Error("<PureTaskList>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\components\TaskList.svelte generated by Svelte v3.12.1 */

    const file$3 = "src\\components\\TaskList.svelte";

    function create_fragment$3(ctx) {
    	var div, current;

    	var puretasklist = new PureTaskList({
    		props: { tasks: ctx.$taskStore },
    		$$inline: true
    	});
    	puretasklist.$on("onPinTask", onPinTask);
    	puretasklist.$on("onArchiveTask", onArchiveTask);

    	const block = {
    		c: function create() {
    			div = element("div");
    			puretasklist.$$.fragment.c();
    			add_location(div, file$3, 76, 0, 1833);
    		},

    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},

    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(puretasklist, div, null);
    			current = true;
    		},

    		p: function update(changed, ctx) {
    			var puretasklist_changes = {};
    			if (changed.$taskStore) puretasklist_changes.tasks = ctx.$taskStore;
    			puretasklist.$set(puretasklist_changes);
    		},

    		i: function intro(local) {
    			if (current) return;
    			transition_in(puretasklist.$$.fragment, local);

    			current = true;
    		},

    		o: function outro(local) {
    			transition_out(puretasklist.$$.fragment, local);
    			current = false;
    		},

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach_dev(div);
    			}

    			destroy_component(puretasklist);
    		}
    	};
    	dispatch_dev("SvelteRegisterBlock", { block, id: create_fragment$3.name, type: "component", source: "", ctx });
    	return block;
    }

    function onPinTask(event) {
      console.log(`tasklist pin task:${event.detail.id}`);
      taskStore.pinTask(event.detail.id);
      
    }

    function onArchiveTask(event) {
      console.log(`tasklist archive task:${event.detail.id}`);
      taskStore.archiveTask(event.detail.id);
    }

    function instance$2($$self, $$props, $$invalidate) {
    	let $taskStore;

    	validate_store(taskStore, 'taskStore');
    	component_subscribe($$self, taskStore, $$value => { $taskStore = $$value; $$invalidate('$taskStore', $taskStore); });

    	$$self.$capture_state = () => {
    		return {};
    	};

    	$$self.$inject_state = $$props => {
    		if ('$taskStore' in $$props) taskStore.set($taskStore);
    	};

    	return { $taskStore };
    }

    class TaskList extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$2, create_fragment$3, safe_not_equal, []);
    		dispatch_dev("SvelteRegisterComponent", { component: this, tagName: "TaskList", options, id: create_fragment$3.name });
    	}
    }

    /* src\components\InboxScreen.svelte generated by Svelte v3.12.1 */

    const file$4 = "src\\components\\InboxScreen.svelte";

    // (15:2) {:else}
    function create_else_block(ctx) {
    	var div, nav, h1, span, t_1, current;

    	var tasklist = new TaskList({ $$inline: true });

    	const block = {
    		c: function create() {
    			div = element("div");
    			nav = element("nav");
    			h1 = element("h1");
    			span = element("span");
    			span.textContent = "Taskbox";
    			t_1 = space();
    			tasklist.$$.fragment.c();
    			attr_dev(span, "class", "title-wrapper");
    			add_location(span, file$4, 18, 10, 472);
    			attr_dev(h1, "class", "title-page");
    			add_location(h1, file$4, 17, 8, 437);
    			add_location(nav, file$4, 16, 6, 422);
    			attr_dev(div, "class", "page lists-show");
    			add_location(div, file$4, 15, 4, 385);
    		},

    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, nav);
    			append_dev(nav, h1);
    			append_dev(h1, span);
    			append_dev(div, t_1);
    			mount_component(tasklist, div, null);
    			current = true;
    		},

    		i: function intro(local) {
    			if (current) return;
    			transition_in(tasklist.$$.fragment, local);

    			current = true;
    		},

    		o: function outro(local) {
    			transition_out(tasklist.$$.fragment, local);
    			current = false;
    		},

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach_dev(div);
    			}

    			destroy_component(tasklist);
    		}
    	};
    	dispatch_dev("SvelteRegisterBlock", { block, id: create_else_block.name, type: "else", source: "(15:2) {:else}", ctx });
    	return block;
    }

    // (7:2) {#if error}
    function create_if_block$2(ctx) {
    	var div3, div2, span, t0, div0, t2, div1;

    	const block = {
    		c: function create() {
    			div3 = element("div");
    			div2 = element("div");
    			span = element("span");
    			t0 = space();
    			div0 = element("div");
    			div0.textContent = "Oh no!";
    			t2 = space();
    			div1 = element("div");
    			div1.textContent = "Something went wrong";
    			attr_dev(span, "class", "icon-face-sad");
    			add_location(span, file$4, 9, 8, 197);
    			attr_dev(div0, "class", "title-message");
    			add_location(div0, file$4, 10, 8, 237);
    			attr_dev(div1, "class", "subtitle-message");
    			add_location(div1, file$4, 11, 8, 286);
    			attr_dev(div2, "class", "wrapper-message");
    			add_location(div2, file$4, 8, 6, 158);
    			attr_dev(div3, "class", "page lists-show");
    			add_location(div3, file$4, 7, 4, 121);
    		},

    		m: function mount(target, anchor) {
    			insert_dev(target, div3, anchor);
    			append_dev(div3, div2);
    			append_dev(div2, span);
    			append_dev(div2, t0);
    			append_dev(div2, div0);
    			append_dev(div2, t2);
    			append_dev(div2, div1);
    		},

    		i: noop,
    		o: noop,

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach_dev(div3);
    			}
    		}
    	};
    	dispatch_dev("SvelteRegisterBlock", { block, id: create_if_block$2.name, type: "if", source: "(7:2) {#if error}", ctx });
    	return block;
    }

    function create_fragment$4(ctx) {
    	var div, current_block_type_index, if_block, current;

    	var if_block_creators = [
    		create_if_block$2,
    		create_else_block
    	];

    	var if_blocks = [];

    	function select_block_type(changed, ctx) {
    		if (ctx.error) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(null, ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			div = element("div");
    			if_block.c();
    			add_location(div, file$4, 5, 0, 95);
    		},

    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},

    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			if_blocks[current_block_type_index].m(div, null);
    			current = true;
    		},

    		p: function update(changed, ctx) {
    			var previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(changed, ctx);
    			if (current_block_type_index !== previous_block_index) {
    				group_outros();
    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});
    				check_outros();

    				if_block = if_blocks[current_block_type_index];
    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				}
    				transition_in(if_block, 1);
    				if_block.m(div, null);
    			}
    		},

    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},

    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach_dev(div);
    			}

    			if_blocks[current_block_type_index].d();
    		}
    	};
    	dispatch_dev("SvelteRegisterBlock", { block, id: create_fragment$4.name, type: "component", source: "", ctx });
    	return block;
    }

    function instance$3($$self, $$props, $$invalidate) {
    	let { error=false } = $$props;

    	const writable_props = ['error'];
    	Object.keys($$props).forEach(key => {
    		if (!writable_props.includes(key) && !key.startsWith('$$')) console.warn(`<InboxScreen> was created with unknown prop '${key}'`);
    	});

    	$$self.$set = $$props => {
    		if ('error' in $$props) $$invalidate('error', error = $$props.error);
    	};

    	$$self.$capture_state = () => {
    		return { error };
    	};

    	$$self.$inject_state = $$props => {
    		if ('error' in $$props) $$invalidate('error', error = $$props.error);
    	};

    	return { error };
    }

    class InboxScreen extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$3, create_fragment$4, safe_not_equal, ["error"]);
    		dispatch_dev("SvelteRegisterComponent", { component: this, tagName: "InboxScreen", options, id: create_fragment$4.name });
    	}

    	get error() {
    		throw new Error("<InboxScreen>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set error(value) {
    		throw new Error("<InboxScreen>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\App.svelte generated by Svelte v3.12.1 */

    function create_fragment$5(ctx) {
    	var current;

    	var inboxscreen = new InboxScreen({
    		props: { error: ctx.$AppStore },
    		$$inline: true
    	});

    	const block = {
    		c: function create() {
    			inboxscreen.$$.fragment.c();
    		},

    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},

    		m: function mount(target, anchor) {
    			mount_component(inboxscreen, target, anchor);
    			current = true;
    		},

    		p: function update(changed, ctx) {
    			var inboxscreen_changes = {};
    			if (changed.$AppStore) inboxscreen_changes.error = ctx.$AppStore;
    			inboxscreen.$set(inboxscreen_changes);
    		},

    		i: function intro(local) {
    			if (current) return;
    			transition_in(inboxscreen.$$.fragment, local);

    			current = true;
    		},

    		o: function outro(local) {
    			transition_out(inboxscreen.$$.fragment, local);
    			current = false;
    		},

    		d: function destroy(detaching) {
    			destroy_component(inboxscreen, detaching);
    		}
    	};
    	dispatch_dev("SvelteRegisterBlock", { block, id: create_fragment$5.name, type: "component", source: "", ctx });
    	return block;
    }

    function instance$4($$self, $$props, $$invalidate) {
    	let $AppStore;

    	validate_store(AppStore, 'AppStore');
    	component_subscribe($$self, AppStore, $$value => { $AppStore = $$value; $$invalidate('$AppStore', $AppStore); });

    	$$self.$capture_state = () => {
    		return {};
    	};

    	$$self.$inject_state = $$props => {
    		if ('$AppStore' in $$props) AppStore.set($AppStore);
    	};

    	return { $AppStore };
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$4, create_fragment$5, safe_not_equal, []);
    		dispatch_dev("SvelteRegisterComponent", { component: this, tagName: "App", options, id: create_fragment$5.name });
    	}
    }

    const app = new App({
    	target: document.body,
    	// initial code
    	/* props: {
    		name: 'world'
    	} */
    });

    return app;

}());
//# sourceMappingURL=bundle.js.map
