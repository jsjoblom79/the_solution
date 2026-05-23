import json
import logging

class ConfigAPI:
    def __init__(self):
        try:
            with open('./config/config.json', 'r') as file:
                self.config = json.load(file)
        except FileNotFoundError:
            logging.error("Config File Not Found")
            raise
        except json.decoder.JSONDecodeError:
            logging.error("Config JSON Decode Error")
            raise


    def getSystemNames(self):
        """ Returns a list of system names """
        systemsNames = []
        for item in self.config["databases"]:
            systemsNames.append({"name": item["name"]})

        return systemsNames

    def getVersion(self):
        """ Gets the current version of the application """
        return self.config["version"]

    def getAppName(self):
        """ Returns the name of the application """
        return self.config["app_name"]

    def getConnectionString(self, name):
        """ Returns the connection string for the application """
        database=None
        for db in self.config["databases"]:
            if db["name"] == name:
                database = db["db"]["connection_string"]

        return database

    def getUrls(self):
        """ Returns the url for the application """
        url = []
        for db in self.config["databases"]:
            url.append({"name": db['name'], "url": db["url"]})

        return url