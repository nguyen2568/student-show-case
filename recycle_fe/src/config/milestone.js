import { Sprout, Leaf, Star, Shield, Flower, Trophy } from "lucide-react";

const milestones = [
    { id: 1, title: "New Journey", icon: Sprout, threshold: 1 },
    { id: 2, title: "The First Step", icon: Leaf, threshold: 2 },
    { id: 3, title: "Green Sprout", icon: Star, threshold: 5 },
    { id: 4, title: "“Eco Explorer”", icon: Flower, threshold: 10 },
    { id: 5, title: "Planet Protector", icon: Shield, threshold: 20 },
    { id: 6, title: "Recycling Champion", icon: Trophy, threshold: 50 },
];

const getCurretMilestone = (recycledCount) => {
    const curMilestone = milestones.filter(m => m.threshold < recycledCount);
    if (curMilestone.length > 0) {
        return curMilestone[curMilestone.length - 1].title;
    }

    return "New Planter";
}

const getNextMilestone = (recycledCount) => {
    const nextMilestone = milestones.filter(m => m.threshold > recycledCount);
    if (nextMilestone.length > 0) {
        return nextMilestone[0].title;
    }

    return "";
}

const getNextGoal = (recycledCount) => {
    
    const nextMilestone = milestones.filter(m => m.threshold > recycledCount);
    if (nextMilestone.length > 0) {
        return nextMilestone[0].threshold;
    }

    return "";
}

const getCurretPerTarget = (recycledCount) => {
    return recycledCount / getNextMilestone(recycledCount);
}

const getPercentage = (recycledCount) => {
    return (recycledCount / getNextGoal(recycledCount) * 100).toFixed(0);
}

export {milestones, getCurretMilestone, getNextMilestone, getNextGoal, getCurretPerTarget, getPercentage};