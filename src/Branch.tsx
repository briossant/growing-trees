import * as React from "react";
import {useEffect, useState} from "react";
import {Vector3} from "three";
import {LineRenderer} from "./LineRenderer";
import {CurveFunction} from "./BranchFunctions/CurveFunctions";
import {HeritageFunctions} from "./BranchFunctions/HeritageFunctions";

export interface BranchFunctions {
    curve: CurveFunction;
    heritage: HeritageFunctions;
}

export interface BranchSettings {
    length: number;
    step: number;
    startingDirection: Vector3;
    curvingDirection: Vector3;
    startingPoint: Vector3;
    color?: string;
    depth: number; // int

    functions: BranchFunctions;
}

// todo : add branch depth for heritage func + floating I and step param

export const Branch: React.FC<BranchSettings> = (params) => {
    const {length, step, color = "green", startingDirection,curvingDirection, startingPoint, functions} = params;
    const [line, setLine] = useState<Array<Vector3>>([startingPoint]);
    const [I, setI] = useState<number>(length);

    const [subBranches, setSubBranches] = useState<Array<BranchSettings>>([]);

    useEffect(() => {
        if (I <=0 ) {
            if (length>step) setSubBranches(functions.heritage(params, line));
            return;
        }
        setI(I-step);

        const p = (functions.curve(I, length, curvingDirection).add(startingDirection).normalize()).add(line[line.length-1]);
        setLine([...line, p]);

    }, [I]);

    return <>
        <LineRenderer color={color} step={step} line={line}/>
        {subBranches.map(br => <Branch key={Math.random()} {...br} />)}
    </>
}