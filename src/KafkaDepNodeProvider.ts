import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import * as kafka from './kafka';


export class KafkaItemNodeProvider implements vscode.TreeDataProvider<KafkaItem> {
    
    private _onDidChangeTreeData: vscode.EventEmitter<KafkaItem | undefined> = new vscode.EventEmitter<KafkaItem | undefined>();
	readonly onDidChangeTreeData: vscode.Event<KafkaItem | undefined> = this._onDidChangeTreeData.event;

    constructor(private workspaceRoot: string) {
	}    

    refresh(): void {
		this._onDidChangeTreeData.fire();
	}

	getTreeItem(element: KafkaItem): vscode.TreeItem {
		return element;
	}

    getChildren(element?: KafkaItem): Thenable<KafkaItem[]> {		        
		let kafkaClient = new kafka.KafkaClient("http://localhost:8082");

		if (element) {            
			return Promise.resolve([]);
		} else {			
			return kafkaClient.getTopics()
				.then(topicNames => {
				return this.getTopicNameNodes(topicNames);
			});
		}
    }
    
    private getTopicNameNodes(topicNames: string[]): KafkaItem[] {		
		let topicNameNodes = topicNames.map(topicName => {
			return new KafkaItem(topicName, vscode.TreeItemCollapsibleState.Collapsed);
		});

		return topicNameNodes;
    }    
}

export class KafkaItem extends vscode.TreeItem {

	constructor(
		public readonly label: string,
		public readonly collapsibleState: vscode.TreeItemCollapsibleState,
		public readonly command?: vscode.Command
	) {
		super(label, collapsibleState);
	}

	get tooltip(): string {
		return this.label;
	}

	get description(): string {
		return this.label;
	}

	contextValue = 'kafkaItem';
}