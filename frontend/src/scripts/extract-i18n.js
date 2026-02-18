// ═══════════════════════════════════════════════════════════════
//  extract-i18n.js — Fixed version with proper hook/module-level detection
// ═══════════════════════════════════════════════════════════════

const fs = require('fs');
const path = require('path');
const parser = require('@babel/parser');
const traverse = require('@babel/traverse').default;
const generate = require('@babel/generator').default;
const t = require('@babel/types');

// ═══════════════════════════════════════════════════════════════
//  CONFIG
// ═══════════════════════════════════════════════════════════════
const CONFIG = {
    srcDir: path.resolve(__dirname, '../../src'),
    outputDir: path.resolve(__dirname, '../public/locales/en'),
    extensions: ['.tsx', '.jsx', '.ts', '.js'],
    ignoreDirs: ['node_modules', '.next', 'dist', 'build', '__tests__', '__mocks__'],

    translatableProperties: [
        'label', 'title', 'description', 'placeholder', 'message',
        'text', 'tooltip', 'hint', 'caption', 'heading', 'subtitle',
        'helperText', 'errorMessage', 'successMessage', 'confirmMessage',
        'header', 'footer', 'content', 'summary', 'detail', 'info',
        'name', 'displayName',
    ],

    skipProperties: [
        'key', 'id', 'className', 'style', 'type', 'name', 'href',
        'src', 'alt', 'role', 'testId', 'data-testid', 'htmlFor',
        'target', 'rel', 'method', 'action', 'encType', 'as',
        'component', 'to', 'path', 'route', 'icon', 'color',
        'variant', 'size', 'weight', 'fill', 'stroke', 'viewBox',
        'd', 'xmlns', 'width', 'height', 'ref', 'value', 'defaultValue',
        'pattern', 'accept', 'autoComplete', 'inputMode', 'format',
    ],

    skipJSXAttributes: [
        'className', 'id', 'key', 'type', 'name', 'href', 'src',
        'style', 'data-testid', 'role', 'htmlFor', 'to', 'ref',
        'onClick', 'onChange', 'onSubmit', 'target', 'rel', 'method',
        'action', 'value', 'defaultValue', 'as', 'component',
        'size', 'variant', 'color', 'weight', 'fill', 'stroke',
        'viewBox', 'd', 'xmlns', 'width', 'height',
    ],

    ignorePatterns: [
        /^[a-z][a-zA-Z]*$/,
        /^[a-z]+([_-][a-z]+)+$/,
        /^[A-Z][A-Z0-9_]+$/,
        /^\d[\d.,]*$/,
        /^#[0-9a-fA-F]{3,8}$/,
        /^(bg|text|border|ring|shadow|rounded|flex|grid|p|m|w|h|gap|space)-/,
        /^(sm|md|lg|xl|2xl):/,
        /^\.[a-zA-Z]/,
        /^https?:\/\//,
        /^mailto:/,
        /^tel:/,
        /^\/[a-z]/,
        /^\s*$/,
        /^[{}()[\]<>]+$/,
        /^(true|false|null|undefined)$/,
        /^(div|span|p|h[1-6]|button|input|form|a|img|svg|path|ul|li|nav|main|section|article|aside|header|footer)$/,
        /^(GET|POST|PUT|DELETE|PATCH|HEAD|OPTIONS)$/,
        /^(string|number|boolean|object|function|symbol|bigint)$/,
        /^[a-z]+:\/\//,
        /^(application|text|image|audio|video)\//,
        /^\d+(\.\d+)?(px|rem|em|vh|vw|%|ms|s)$/,
        /^rgb[a]?\(/,
        /^hsl[a]?\(/,
        /^[A-Z][A-Z_]*\.[A-Z]/,
    ],
};

// ═══════════════════════════════════════════════════════════════
//  STATE
// ═══════════════════════════════════════════════════════════════
const categorizedTranslations = {};
const allReplacements = [];

// ═══════════════════════════════════════════════════════════════
//  HELPERS
// ═══════════════════════════════════════════════════════════════

function isTailwindOrCSSClassString(str) {
    if (!str || typeof str !== 'string') return false;

    const trimmed = str.trim();
    if (!trimmed) return true;

    const tokens = trimmed.split(/\s+/);
    if (tokens.length === 0) return false;

    const standaloneUtilities = new Set([
        'flex', 'grid', 'block', 'inline', 'hidden', 'absolute', 'relative',
        'fixed', 'sticky', 'static', 'table', 'contents', 'truncate',
        'overflow', 'underline', 'uppercase', 'lowercase', 'capitalize',
        'italic', 'antialiased', 'ordinal', 'container', 'sr',
        'transition', 'transform', 'filter', 'backdrop',
    ]);

    const tailwindPrefixes = new Set([
        'bg', 'text', 'border', 'ring', 'shadow', 'rounded', 'flex', 'grid',
        'p', 'px', 'py', 'pt', 'pr', 'pb', 'pl', 'm', 'mx', 'my', 'mt',
        'mr', 'mb', 'ml', 'w', 'h', 'min', 'max', 'gap', 'space', 'divide',
        'font', 'leading', 'tracking', 'list', 'decoration', 'underline',
        'whitespace', 'break', 'overflow', 'overscroll', 'z', 'order',
        'col', 'row', 'auto', 'place', 'items', 'justify', 'self', 'content',
        'object', 'top', 'right', 'bottom', 'left', 'inset', 'float', 'clear',
        'isolation', 'box', 'display', 'table', 'caption', 'transition',
        'duration', 'ease', 'delay', 'animate', 'transform', 'origin',
        'scale', 'rotate', 'translate', 'skew', 'appearance', 'cursor',
        'outline', 'pointer', 'resize', 'select', 'fill', 'stroke',
        'sr', 'not', 'first', 'last', 'odd', 'even', 'visited', 'checked',
        'disabled', 'hover', 'focus', 'active', 'group', 'peer',
        'sm', 'md', 'lg', 'xl', '2xl', 'dark', 'motion', 'print',
        'aspect', 'columns', 'break', 'grow', 'shrink', 'basis',
        'snap', 'scroll', 'touch', 'will', 'accent', 'caret',
        'blur', 'brightness', 'contrast', 'drop', 'grayscale', 'hue',
        'invert', 'saturate', 'sepia', 'backdrop',
        'inline', 'opacity',
    ]);

    let classLikeCount = 0;

    for (const token of tokens) {
        const withoutModifier = token.replace(/^[a-zA-Z0-9-]+:/g, '');
        const segment = withoutModifier || token;

        const isClassLike =
            segment.includes('-') ||
            standaloneUtilities.has(segment.toLowerCase()) ||
            tailwindPrefixes.has(segment.split('-')[0].toLowerCase()) ||
            segment.startsWith('!') ||
            /^\d+$/.test(segment) ||
            /\[.*\]/.test(segment);

        if (isClassLike) classLikeCount++;
    }

    if (classLikeCount === tokens.length) return true;
    if (tokens.length >= 3 && classLikeCount / tokens.length >= 0.8) return true;

    return false;
}

function isInsideSkippedJSXAttribute(nodePath) {
    let current = nodePath.parentPath;
    while (current) {
        if (t.isJSXAttribute(current.node)) {
            const attrName = current.node.name;
            if (t.isJSXIdentifier(attrName)) {
                if (CONFIG.skipJSXAttributes.includes(attrName.name)) {
                    return true;
                }
            }
            return false;
        }
        if (
            t.isJSXElement(current.node) ||
            t.isJSXFragment(current.node) ||
            t.isFunction(current.node) ||
            t.isProgram(current.node)
        ) {
            return false;
        }
        current = current.parentPath;
    }
    return false;
}

// ═══════════════════════════════════════════════════════════════
//  FIX: NEW HELPER — Detect if inside a React component function
// ═══════════════════════════════════════════════════════════════
function isInsideReactComponentFunction(nodePath) {
    let current = nodePath.parentPath;

    while (current) {
        // Check if we're inside any function
        if (
            t.isFunctionDeclaration(current.node) ||
            t.isFunctionExpression(current.node) ||
            t.isArrowFunctionExpression(current.node)
        ) {
            // Get the function name
            let funcName = null;

            if (t.isFunctionDeclaration(current.node) && current.node.id) {
                funcName = current.node.id.name;
            } else if (
                t.isVariableDeclarator(current.parent) &&
                t.isIdentifier(current.parent.id)
            ) {
                funcName = current.parent.id.name;
            } else if (t.isExportDefaultDeclaration(current.parent)) {
                // Default export — check if it returns JSX
                funcName = '_DefaultExport';
            } else if (
                t.isAssignmentExpression(current.parent) &&
                t.isIdentifier(current.parent.left)
            ) {
                funcName = current.parent.left.name;
            }

            // React components start with uppercase letter
            if (funcName && /^[A-Z_]/.test(funcName)) {
                // Additional heuristic: check if the function returns JSX
                let returnsJSX = false;
                try {
                    current.traverse({
                        ReturnStatement(retPath) {
                            const arg = retPath.node.argument;
                            if (!arg) return;

                            if (t.isJSXElement(arg) || t.isJSXFragment(arg)) {
                                returnsJSX = true;
                                retPath.stop();
                            }
                            if (t.isParenthesizedExpression(arg)) {
                                const inner = arg.expression;
                                if (t.isJSXElement(inner) || t.isJSXFragment(inner)) {
                                    returnsJSX = true;
                                    retPath.stop();
                                }
                            }
                            // Conditional returns
                            if (t.isConditionalExpression(arg)) {
                                if (
                                    t.isJSXElement(arg.consequent) ||
                                    t.isJSXElement(arg.alternate) ||
                                    t.isJSXFragment(arg.consequent) ||
                                    t.isJSXFragment(arg.alternate)
                                ) {
                                    returnsJSX = true;
                                    retPath.stop();
                                }
                            }
                        },
                    });
                } catch (e) {
                    // Traverse can throw if path is already removed
                }

                // If name starts with uppercase AND returns JSX → it's a component
                if (returnsJSX || funcName === '_DefaultExport') {
                    return true;
                }

                // For uppercase-named functions, assume component even without JSX detection
                // (could be returning another component call)
                if (funcName && /^[A-Z]/.test(funcName) && funcName !== '_DefaultExport') {
                    return true;
                }
            }

            // If we found a non-component function, stop — we're not in a component
            // (We don't want nested helper functions inside components to count as "not in component")
            // So we DON'T return false here; we continue up the tree
        }

        // Stop at program level
        if (t.isProgram(current.node)) {
            return false;
        }

        current = current.parentPath;
    }

    return false;
}

function shouldTranslate(str) {
    if (!str || str.trim().length === 0) return false;
    if (str.length < 2) return false;
    if (isTailwindOrCSSClassString(str)) return false;

    for (const pattern of CONFIG.ignorePatterns) {
        if (pattern.test(str.trim())) return false;
    }

    if (!/[a-zA-Z]/.test(str)) return false;

    return true;
}

function getNamespace(filePath) {
    const rel = path.relative(CONFIG.srcDir, filePath);
    const parts = rel.split(path.sep);

    if (parts.length >= 2) {
        const skipDirs = ['components', 'pages', 'views', 'features', 'modules', 'screens', 'layouts'];
        for (let i = 0; i < parts.length - 1; i++) {
            if (!skipDirs.includes(parts[i])) {
                return parts[i];
            }
        }
        return parts[parts.length - 2];
    }

    return 'common';
}

function getCategoryKey(filePath) {
    const rel = path.relative(CONFIG.srcDir, filePath);
    const parts = rel.split(path.sep);

    if (parts.length > 1) {
        return parts.slice(0, -1).join('/');
    }
    return 'root';
}

function generateKey(text, filePath) {
    let clean = text
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, '')
        .replace(/\s+/g, '_')
        .substring(0, 50)
        .replace(/_+$/, '');

    return clean || 'untitled';
}

function addTranslation(namespace, category, key, value) {
    if (!categorizedTranslations[category]) {
        categorizedTranslations[category] = {};
    }
    if (!categorizedTranslations[category][namespace]) {
        categorizedTranslations[category][namespace] = {};
    }

    const store = categorizedTranslations[category][namespace];

    let finalKey = key;
    let counter = 1;
    while (store[finalKey] && store[finalKey] !== value) {
        finalKey = `${key}_${counter++}`;
    }

    store[finalKey] = value;
    return finalKey;
}

function isTranslatablePropertyName(propName) {
    if (!propName) return false;
    const lower = propName.toLowerCase();

    if (CONFIG.skipProperties.includes(propName)) return false;
    if (CONFIG.translatableProperties.includes(propName)) return true;

    const translatableWords = [
        'label', 'title', 'text', 'message', 'description',
        'placeholder', 'tooltip', 'hint', 'caption', 'heading',
        'content', 'name', 'summary', 'info', 'warning', 'error',
        'success', 'confirm', 'cancel', 'submit', 'help',
    ];
    return translatableWords.some((word) => lower.includes(word));
}

function isInsideJSX(nodePath) {
    let current = nodePath.parentPath;
    while (current) {
        if (
            t.isJSXElement(current.node) ||
            t.isJSXFragment(current.node) ||
            t.isJSXAttribute(current.node) ||
            t.isJSXExpressionContainer(current.node)
        ) {
            return true;
        }
        current = current.parentPath;
    }
    return false;
}

function isInImport(nodePath) {
    let current = nodePath.parentPath;
    while (current) {
        if (t.isImportDeclaration(current.node)) return true;
        if (
            t.isCallExpression(current.node) &&
            t.isIdentifier(current.node.callee, { name: 'require' })
        )
            return true;
        current = current.parentPath;
    }
    return false;
}

// ═══════════════════════════════════════════════════════════════
//  FIX: Helper to determine which t() to use
// ═══════════════════════════════════════════════════════════════
function determineTranslationMethod(nodePath, isComponentFile) {
    if (!isComponentFile) {
        // Non-component files always use module-level t
        return 'module';
    }

    // For component files, check if we're inside a React component
    if (isInsideReactComponentFunction(nodePath)) {
        return 'hook';
    }

    // Outside component functions in a component file → use module-level t
    return 'module';
}

// ═══════════════════════════════════════════════════════════════
//  AST TRANSFORMATION
// ═══════════════════════════════════════════════════════════════

function transformFile(filePath) {
    const code = fs.readFileSync(filePath, 'utf-8');
    const namespace = getNamespace(filePath);
    const category = getCategoryKey(filePath);
    let modified = false;
    let needsHook = false;
    let needsModuleLevelT = false; // FIX: Renamed for clarity
    const replacements = [];
    const isComponentFile = /\.(jsx|tsx)$/.test(filePath);

    let ast;
    try {
        ast = parser.parse(code, {
            sourceType: 'module',
            plugins: ['jsx', 'typescript', 'decorators-legacy', 'classProperties'],
        });
    } catch (err) {
        console.warn(`  ⚠ Parse error in ${filePath}: ${err.message}`);
        return null;
    }

    traverse(ast, {
        // ─────────────────────────────────────────────
        //  1. JSX TEXT: <p>Hello World</p>
        // ─────────────────────────────────────────────
        JSXText(nodePath) {
            const text = nodePath.node.value.trim();
            if (!shouldTranslate(text)) return;

            const baseKey = generateKey(text, filePath);
            const key = addTranslation(namespace, category, baseKey, text);

            nodePath.replaceWith(
                t.jsxExpressionContainer(
                    t.callExpression(t.identifier('t'), [t.stringLiteral(key)])
                )
            );

            modified = true;
            // JSX text is always inside a component
            needsHook = true;
            replacements.push({ type: 'jsx-text', key, value: text });
        },

        // ─────────────────────────────────────────────
        //  2. JSX ATTRIBUTES: <input placeholder="Enter name" />
        // ─────────────────────────────────────────────
        JSXAttribute(nodePath) {
            const attrName = nodePath.node.name;
            if (!t.isJSXIdentifier(attrName)) return;

            if (CONFIG.skipJSXAttributes.includes(attrName.name)) return;

            const value = nodePath.node.value;
            if (!t.isStringLiteral(value)) return;
            if (!shouldTranslate(value.value)) return;

            const baseKey = generateKey(value.value, filePath);
            const key = addTranslation(namespace, category, baseKey, value.value);

            nodePath.node.value = t.jsxExpressionContainer(
                t.callExpression(t.identifier('t'), [t.stringLiteral(key)])
            );

            modified = true;
            // JSX attributes are always inside a component
            needsHook = true;
            replacements.push({ type: 'jsx-attr', attr: attrName.name, key, value: value.value });
        },

        // ─────────────────────────────────────────────
        //  3. STRING LITERALS in JSX expressions: {'Hello'}
        // ─────────────────────────────────────────────
        StringLiteral(nodePath) {
            if (!t.isJSXExpressionContainer(nodePath.parent)) return;
            if (!shouldTranslate(nodePath.node.value)) return;

            const baseKey = generateKey(nodePath.node.value, filePath);
            const key = addTranslation(namespace, category, baseKey, nodePath.node.value);

            nodePath.replaceWith(
                t.callExpression(t.identifier('t'), [t.stringLiteral(key)])
            );

            modified = true;
            // JSX expressions are inside a component
            needsHook = true;
            replacements.push({ type: 'jsx-expr', key, value: nodePath.node.value });
        },

        // ─────────────────────────────────────────────
        //  4. OBJECT PROPERTIES: { label: 'Hello' }
        // ─────────────────────────────────────────────
        ObjectProperty(nodePath) {
            if (isInImport(nodePath)) return;

            const keyNode = nodePath.node.key;
            const valueNode = nodePath.node.value;

            if (!t.isStringLiteral(valueNode)) return;
            if (!shouldTranslate(valueNode.value)) return;

            let propName = null;
            if (t.isIdentifier(keyNode)) {
                propName = keyNode.name;
            } else if (t.isStringLiteral(keyNode)) {
                propName = keyNode.value;
            }

            if (propName && CONFIG.skipProperties.includes(propName)) return;

            const isKnownTranslatable = propName && isTranslatablePropertyName(propName);
            const looksLikeText = valueNode.value.includes(' ') && /[A-Z]/.test(valueNode.value[0]);

            if (!isKnownTranslatable && !looksLikeText) return;

            const baseKey = generateKey(valueNode.value, filePath);
            const key = addTranslation(namespace, category, baseKey, valueNode.value);

            nodePath.node.value = t.callExpression(t.identifier('t'), [
                t.stringLiteral(key),
            ]);

            modified = true;

            // FIX: Determine which t() to use based on context
            const method = determineTranslationMethod(nodePath, isComponentFile);
            if (method === 'hook') {
                needsHook = true;
            } else {
                needsModuleLevelT = true;
            }

            replacements.push({
                type: 'obj-prop',
                prop: propName || '(computed)',
                key,
                value: valueNode.value,
            });
        },

        // ─────────────────────────────────────────────
        //  5. VARIABLE DECLARATIONS: const msg = "Hello"
        // ─────────────────────────────────────────────
        VariableDeclarator(nodePath) {
            const init = nodePath.node.init;
            if (!t.isStringLiteral(init)) return;
            if (!shouldTranslate(init.value)) return;

            const varName = t.isIdentifier(nodePath.node.id) ? nodePath.node.id.name : null;
            if (!varName) return;

            const translatableVarPatterns = [
                /message/i, /label/i, /title/i, /text/i, /description/i,
                /placeholder/i, /tooltip/i, /hint/i, /caption/i, /heading/i,
                /content/i, /error/i, /warning/i, /info/i, /success/i,
            ];

            const looksTranslatable = translatableVarPatterns.some((p) => p.test(varName));
            const looksLikeText = init.value.includes(' ') && /[A-Z]/.test(init.value[0]);

            if (!looksTranslatable && !looksLikeText) return;

            const baseKey = generateKey(init.value, filePath);
            const key = addTranslation(namespace, category, baseKey, init.value);

            nodePath.node.init = t.callExpression(t.identifier('t'), [
                t.stringLiteral(key),
            ]);

            modified = true;

            // FIX: Determine which t() to use based on context
            const method = determineTranslationMethod(nodePath, isComponentFile);
            if (method === 'hook') {
                needsHook = true;
            } else {
                needsModuleLevelT = true;
            }

            replacements.push({ type: 'variable', var: varName, key, value: init.value });
        },

        // ─────────────────────────────────────────────
        //  6. TEMPLATE LITERALS with text: `Hello ${name}`
        // ─────────────────────────────────────────────
        TemplateLiteral(nodePath) {
            const quasis = nodePath.node.quasis;
            const expressions = nodePath.node.expressions;

            if (expressions.length === 0) return;
            if (quasis.every((q) => !shouldTranslate(q.value.cooked || ''))) return;

            if (isInsideSkippedJSXAttribute(nodePath)) return;

            const fullStaticText = quasis.map((q) => q.value.cooked || '').join(' ');
            if (isTailwindOrCSSClassString(fullStaticText)) return;

            let propName = null;
            if (t.isObjectProperty(nodePath.parent)) {
                const keyNode = nodePath.parent.key;
                propName = t.isIdentifier(keyNode) ? keyNode.name : null;
                if (propName && CONFIG.skipProperties.includes(propName)) return;
                if (propName && !isTranslatablePropertyName(propName)) return;
            }

            let i18nStr = '';
            const interpolationProps = [];

            quasis.forEach((quasi, idx) => {
                i18nStr += quasi.value.cooked || '';
                if (idx < expressions.length) {
                    const expr = expressions[idx];
                    let paramName;
                    if (t.isIdentifier(expr)) {
                        paramName = expr.name;
                    } else if (t.isMemberExpression(expr) && t.isIdentifier(expr.property)) {
                        paramName = expr.property.name;
                    } else {
                        paramName = `val${idx}`;
                    }
                    i18nStr += `{{${paramName}}}`;
                    interpolationProps.push({ paramName, expr });
                }
            });

            if (!shouldTranslate(i18nStr.replace(/\{\{.*?\}\}/g, ' '))) return;

            const baseKey = generateKey(i18nStr.replace(/\{\{.*?\}\}/g, ''), filePath);
            const key = addTranslation(namespace, category, baseKey, i18nStr);

            const args = [t.stringLiteral(key)];
            if (interpolationProps.length > 0) {
                args.push(
                    t.objectExpression(
                        interpolationProps.map((p) =>
                            t.objectProperty(t.identifier(p.paramName), p.expr)
                        )
                    )
                );
            }

            nodePath.replaceWith(t.callExpression(t.identifier('t'), args));
            modified = true;

            // FIX: Determine which t() to use based on context
            const method = determineTranslationMethod(nodePath, isComponentFile);
            if (method === 'hook') {
                needsHook = true;
            } else {
                needsModuleLevelT = true;
            }

            replacements.push({ type: 'template', key, value: i18nStr });
        },

        // ─────────────────────────────────────────────
        //  7. ARRAY ELEMENTS: ['Option A', 'Option B']
        // ─────────────────────────────────────────────
        ArrayExpression(nodePath) {
            nodePath.node.elements.forEach((element, idx) => {
                if (!t.isStringLiteral(element)) return;
                if (!shouldTranslate(element.value)) return;

                const looksLikeText = element.value.includes(' ') || /^[A-Z]/.test(element.value);
                if (!looksLikeText) return;

                const baseKey = generateKey(element.value, filePath);
                const key = addTranslation(namespace, category, baseKey, element.value);

                nodePath.node.elements[idx] = t.callExpression(t.identifier('t'), [
                    t.stringLiteral(key),
                ]);

                modified = true;

                // FIX: Determine which t() to use based on context
                const method = determineTranslationMethod(nodePath, isComponentFile);
                if (method === 'hook') {
                    needsHook = true;
                } else {
                    needsModuleLevelT = true;
                }

                replacements.push({ type: 'array', key, value: element.value });
            });
        },
    });

    // ─── Inject imports and hooks ───
    if (modified) {
        // FIX: Always inject module-level t FIRST (if needed)
        // This ensures functions outside components have access to t
        if (needsModuleLevelT) {
            injectModuleLevelT(ast);
        }

        // FIX: Then inject useTranslation hook into components (if needed)
        // The hook's `t` will shadow the module-level `t` inside components
        if (needsHook && isComponentFile) {
            injectUseTranslation(ast, namespace);
        }

        const output = generate(ast, {
            retainLines: true,
            jsescOption: { minimal: true },
        });

        const relPath = path.relative(CONFIG.srcDir, filePath);
        allReplacements.push({ file: relPath, replacements });

        return { filePath, code: output.code, replacements };
    }

    return null;
}

// ═══════════════════════════════════════════════════════════════
//  IMPORT / HOOK INJECTION
// ═══════════════════════════════════════════════════════════════

// FIX: New function to inject module-level t for non-component usage
function injectModuleLevelT(ast) {
    const body = ast.program.body;

    // Check if i18next is already imported
    const alreadyImported = body.some(
        (node) =>
            t.isImportDeclaration(node) &&
            (node.source.value === 'i18next' ||
                node.source.value === '../i18n' ||
                node.source.value === './i18n' ||
                node.source.value === '@/i18n')
    );

    // Check if module-level t already exists
    const alreadyHasT = body.some(
        (node) =>
            t.isVariableDeclaration(node) &&
            node.declarations.some(
                (d) =>
                    t.isIdentifier(d.id, { name: 't' }) ||
                    (t.isObjectPattern(d.id) &&
                        d.id.properties.some(
                            (p) => t.isObjectProperty(p) && t.isIdentifier(p.key, { name: 't' })
                        ))
            )
    );

    if (alreadyHasT) return;

    let lastImportIdx = -1;
    body.forEach((node, idx) => {
        if (t.isImportDeclaration(node)) lastImportIdx = idx;
    });

    if (!alreadyImported) {
        // Import i18next
        const importDecl = t.importDeclaration(
            [t.importDefaultSpecifier(t.identifier('i18n'))],
            t.stringLiteral('i18next')
        );
        body.splice(lastImportIdx + 1, 0, importDecl);
        lastImportIdx++;
    }

    // Add: const t = i18n.t.bind(i18n);
    // This creates a module-level t function that can be used outside components
    const tDecl = t.variableDeclaration('const', [
        t.variableDeclarator(
            t.identifier('t'),
            t.callExpression(
                t.memberExpression(
                    t.memberExpression(t.identifier('i18n'), t.identifier('t')),
                    t.identifier('bind')
                ),
                [t.identifier('i18n')]
            )
        ),
    ]);

    // Insert after all imports
    body.splice(lastImportIdx + 1, 0, tDecl);
}

function injectUseTranslation(ast, namespace) {
    const body = ast.program.body;

    // Check if already imported
    const alreadyImported = body.some(
        (node) =>
            t.isImportDeclaration(node) &&
            node.source.value === 'react-i18next' &&
            node.specifiers.some(
                (s) => t.isImportSpecifier(s) && t.isIdentifier(s.imported, { name: 'useTranslation' })
            )
    );

    if (!alreadyImported) {
        const importDecl = t.importDeclaration(
            [t.importSpecifier(t.identifier('useTranslation'), t.identifier('useTranslation'))],
            t.stringLiteral('react-i18next')
        );
        let lastImportIdx = -1;
        body.forEach((node, idx) => {
            if (t.isImportDeclaration(node)) lastImportIdx = idx;
        });
        body.splice(lastImportIdx + 1, 0, importDecl);
    }

    // Inject hook into component functions
    traverse(ast, {
        Function(fnPath) {
            let funcName = null;

            if (t.isFunctionDeclaration(fnPath.node) && fnPath.node.id) {
                funcName = fnPath.node.id.name;
            } else if (t.isVariableDeclarator(fnPath.parent) && t.isIdentifier(fnPath.parent.id)) {
                funcName = fnPath.parent.id.name;
            } else if (t.isExportDefaultDeclaration(fnPath.parent)) {
                funcName = 'default';
            }

            // Check if this function returns JSX
            let returnsJSX = false;
            fnPath.traverse({
                ReturnStatement(retPath) {
                    const arg = retPath.node.argument;
                    if (!arg) return;

                    if (t.isJSXElement(arg) || t.isJSXFragment(arg)) {
                        returnsJSX = true;
                    }
                    if (t.isParenthesizedExpression(arg)) {
                        const inner = arg.expression;
                        if (t.isJSXElement(inner) || t.isJSXFragment(inner)) {
                            returnsJSX = true;
                        }
                    }
                    if (t.isConditionalExpression(arg)) {
                        if (
                            t.isJSXElement(arg.consequent) ||
                            t.isJSXElement(arg.alternate) ||
                            t.isJSXFragment(arg.consequent) ||
                            t.isJSXFragment(arg.alternate)
                        ) {
                            returnsJSX = true;
                        }
                    }
                },
            });

            if (!returnsJSX && funcName !== 'default') return;
            if (funcName && !/^[A-Z]/.test(funcName) && funcName !== 'default') return;

            const fnBody = fnPath.node.body;
            if (!t.isBlockStatement(fnBody)) return;

            // Check if already has useTranslation
            const alreadyHasHook = fnBody.body.some((stmt) => {
                if (!t.isVariableDeclaration(stmt)) return false;
                return stmt.declarations.some(
                    (d) =>
                        t.isCallExpression(d.init) &&
                        t.isIdentifier(d.init.callee, { name: 'useTranslation' })
                );
            });

            if (alreadyHasHook) {
                fnPath.stop();
                return;
            }

            // Inject: const { t } = useTranslation('namespace')
            // This will shadow the module-level t inside this component
            const hookCall = t.variableDeclaration('const', [
                t.variableDeclarator(
                    t.objectPattern([t.objectProperty(t.identifier('t'), t.identifier('t'), false, true)]),
                    t.callExpression(t.identifier('useTranslation'), [t.stringLiteral(namespace)])
                ),
            ]);

            fnBody.body.unshift(hookCall);
            fnPath.stop();
        },
    });
}

// Legacy function for non-component .ts files (kept for backwards compatibility)
function injectI18nImport(ast) {
    injectModuleLevelT(ast);
}

// ═══════════════════════════════════════════════════════════════
//  FILE DISCOVERY
// ═══════════════════════════════════════════════════════════════

function findFiles(dir) {
    const results = [];
    const entries = fs.readdirSync(dir, { withFileTypes: true });

    for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);

        if (entry.isDirectory()) {
            if (CONFIG.ignoreDirs.includes(entry.name)) continue;
            results.push(...findFiles(fullPath));
        } else if (entry.isFile()) {
            const ext = path.extname(entry.name);
            if (CONFIG.extensions.includes(ext)) {
                results.push(fullPath);
            }
        }
    }

    return results;
}

// ═══════════════════════════════════════════════════════════════
//  MAIN
// ═══════════════════════════════════════════════════════════════

function main() {
    console.log('═══════════════════════════════════════════════════');
    console.log('  i18n String Extraction Tool (Fixed)');
    console.log('═══════════════════════════════════════════════════');
    console.log(`  Source: ${CONFIG.srcDir}`);
    console.log(`  Output: ${CONFIG.outputDir}`);
    console.log('');

    const files = findFiles(CONFIG.srcDir);
    console.log(`  Found ${files.length} source files\n`);

    const results = [];
    for (const file of files) {
        const relPath = path.relative(CONFIG.srcDir, file);
        process.stdout.write(`  Processing: ${relPath}...`);
        const result = transformFile(file);
        if (result) {
            results.push(result);
            console.log(` ✓ (${result.replacements.length} strings)`);
        } else {
            console.log(' (no changes)');
        }
    }

    console.log('\n─── Writing modified source files ───\n');
    for (const result of results) {
        fs.writeFileSync(result.filePath, result.code, 'utf-8');
        const relPath = path.relative(CONFIG.srcDir, result.filePath);
        console.log(`  ✓ ${relPath}`);
    }

    console.log('\n─── Writing translation files ───\n');
    fs.mkdirSync(CONFIG.outputDir, { recursive: true });

    const mergedNamespaces = {};
    for (const [category, namespaces] of Object.entries(categorizedTranslations)) {
        for (const [ns, translations] of Object.entries(namespaces)) {
            if (!mergedNamespaces[ns]) mergedNamespaces[ns] = {};
            mergedNamespaces[ns] = { ...mergedNamespaces[ns], ...translations };
        }
    }

    let totalKeys = 0;
    for (const [ns, translations] of Object.entries(mergedNamespaces)) {
        const filePath = path.join(CONFIG.outputDir, `${ns}.json`);

        let existing = {};
        if (fs.existsSync(filePath)) {
            try {
                existing = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
            } catch {
                // ignore
            }
        }

        const merged = { ...existing, ...translations };
        fs.writeFileSync(filePath, JSON.stringify(merged, null, 2) + '\n', 'utf-8');
        const keyCount = Object.keys(translations).length;
        totalKeys += keyCount;
        console.log(`  ✓ ${ns}.json (${keyCount} keys)`);
    }

    console.log('\n─── Summary ───\n');
    console.log(`  Files modified:     ${results.length}`);
    console.log(`  Total strings:      ${totalKeys}`);
    console.log(`  Translation files:  ${Object.keys(mergedNamespaces).length}`);

    console.log('\n─── By Category ───\n');
    for (const [category, namespaces] of Object.entries(categorizedTranslations)) {
        let catTotal = 0;
        for (const translations of Object.values(namespaces)) {
            catTotal += Object.keys(translations).length;
        }
        console.log(`  📁 ${category}: ${catTotal} strings`);
    }

    console.log('\n═══════════════════════════════════════════════════');
    console.log('  Done! Review the changes and run your app.');
    console.log('═══════════════════════════════════════════════════\n');
}

main();
