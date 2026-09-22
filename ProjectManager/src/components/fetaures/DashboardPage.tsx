import { Card } from "../ui/card";
import { Separator } from "../ui/separator";

const DashboardPage = () => {
	return (
    <div>
        <div>
            <div className="flex justify-between">
                <div className="m-2">dahsboard headline</div>
                <div className="m-2 text-sm text-muted-foreground">new project trigger</div>
            </div>
        </div>
        <Separator />
        <div>
            <div className="flex flex-row gap-3 justify-between">
                <div className="m-4"> projects </div>
                <Separator orientation="vertical" />
                <div className="m-4"> open tasks </div>
                <Separator orientation="vertical" />
                <div className="m-4"> completed </div>
                <Separator orientation="vertical" />
                <div className="m-4"> overdue </div>
            </div>
        </div>
        <Separator />
        <div className="flex flex-row justify bewtween">
            <Card className="m-10">
                project progress
            </Card>
            <Card className="m-10">
                due soon
            </Card>
        </div>
        <Separator />
        <div>
            recent activity section
        </div>
    </div>
    )
};

export default DashboardPage;