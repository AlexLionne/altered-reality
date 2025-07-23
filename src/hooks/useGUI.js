// src/hooks/useLilGui.js
import { useEffect, useRef } from 'react'
import GUI from 'lil-gui'

/**
 * useGUI
 * @param {(gui: GUI) => void} configureCallback - Fonction dans laquelle vous ajoutez vos contrôles
 */
export function useGUI(configureCallback) {
    const guiRef = useRef(null)

    useEffect(() => {
        const gui = new GUI()
        guiRef.current = gui

        // laissez l'utilisateur configurer son GUI
        configureCallback(gui)

        return () => {
            gui.destroy()
            guiRef.current = null
        }
    }, [configureCallback])

    return guiRef
}